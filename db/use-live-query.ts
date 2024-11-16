import { SQL, Subquery } from 'drizzle-orm'
import { is } from 'drizzle-orm/entity'
import {
  type AnySQLiteSelect,
  getTableConfig,
  getViewConfig,
  SQLiteTable,
  SQLiteView,
} from 'drizzle-orm/sqlite-core'
import { SQLiteRelationalQuery } from 'drizzle-orm/sqlite-core/query-builders/query'
import { addDatabaseChangeListener } from 'expo-sqlite'
import { useEffect, useReducer, useRef } from 'react'
import type * as schema from './schema'
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite'
import { db } from './drizzle'

// Define the state and action types
type State<T> =
  | { status: 'pending'; data: undefined; updatedAt?: Date }
  | { status: 'success'; data: Awaited<T>; updatedAt: Date }
  | { status: 'error'; error: Error; data: undefined; updatedAt: Date }

type Action<T> =
  | { type: 'success'; data: Awaited<T> }
  | { type: 'error'; error: Error }
  | { type: 'pending' }

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case 'success':
      return {
        status: 'success',
        data: action.data,
        updatedAt: new Date(),
      }
    case 'error':
      return {
        status: 'error',
        error: action.error,
        updatedAt: new Date(),
        data: undefined,
      }
    case 'pending':
      return {
        ...state,
        data: undefined,
        status: 'pending',
      }
    default:
      return state
  }
}

export const useLiveQuery = <
  T extends Pick<AnySQLiteSelect, '_' | 'then'> | SQLiteRelationalQuery<'sync', unknown>,
>(
  query: (db: ExpoSQLiteDatabase<typeof schema>) => T,
  deps: unknown[] = [],
  extraTable?: (SQLiteTable | SQLiteView)[],
) => {
  const initialState: State<T> = {
    data: (is(query(db), SQLiteRelationalQuery) && (query(db) as any).mode === 'first'
      ? undefined
      : []) as Awaited<T>,
    status: 'pending',
  }

  const [state, dispatch] = useReducer(reducer<T>, initialState)
  const promiseRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    const _query = query(db)
    const entity = is(_query, SQLiteRelationalQuery)
      ? (_query as any).table
      : (_query as AnySQLiteSelect).config.table

    if (is(entity, Subquery) || is(entity, SQL)) {
      dispatch({
        type: 'error',
        error: new Error('Selecting from subqueries and SQL are not supported in useLiveQuery'),
      })
      return
    }

    let listener: ReturnType<typeof addDatabaseChangeListener> | undefined

    const handleData = (data: any) => {
      dispatch({ type: 'success', data })
    }

    const fetchData = () => {
      promiseRef.current = _query.then(handleData).catch((error) => {
        dispatch({ type: 'error', error })
      })
      return promiseRef.current
    }

    fetchData()

    if (is(entity, SQLiteTable) || is(entity, SQLiteView)) {
      const config = is(entity, SQLiteTable) ? getTableConfig(entity) : getViewConfig(entity)

      const extraTableNames =
        extraTable?.map((table) =>
          is(table, SQLiteTable) ? getTableConfig(table) : getViewConfig(table),
        ) ?? []

      const tables = [config, ...extraTableNames].map((table) => table.name)

      listener = addDatabaseChangeListener(({ tableName }) => {
        if (tables.includes(tableName)) {
          fetchData()
        }
      })
    }

    return () => {
      listener?.remove()
    }
  }, deps)

  if (state.status === 'pending' && promiseRef.current) {
    throw promiseRef.current
  }

  if (state.status === 'error') {
    throw state.error
  }

  return {
    data: state.data,
    status: state.status,
    updatedAt: state.updatedAt,
  } as const
}
