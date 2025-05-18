import { createPool, type Pool, type PoolConnection } from "mysql2/promise"
import { logger } from "./logger"

// Connection pool configuration
const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
}

// Create a singleton pool instance
let pool: Pool

// Initialize the database pool
export const initPool = (): Pool => {
  if (!pool) {
    logger.info("Initializing database connection pool", "db")
    pool = createPool(poolConfig)

    // Add error handler to the pool
    pool.on("error", (err) => {
      logger.error("Unexpected database pool error", "db", undefined, err)
    })
  }
  return pool
}

// Get the database pool
export const getPool = (): Pool => {
  if (!pool) {
    return initPool()
  }
  return pool
}

// Execute a query with automatic connection management
export const executeQuery = async <T = any>(query: string, params?: any[]): Promise<T[]> => {
  const pool = getPool()
  let connection: PoolConnection | undefined

  try {
    // Get a connection from the pool
    connection = await pool.getConnection()

    // Execute the query
    const [rows] = await connection.execute(query, params)

    // Return the result
    return rows as T[]
  } catch (error) {
    logger.error(`Database query failed: ${query}`, "db", { params }, error as Error)
    throw error
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}

// Execute a transaction with multiple queries
export const executeTransaction = async <T = any>(queries: { query: string; params?: any[] }[]): Promise<T[][]> => {
  const pool = getPool()
  let connection: PoolConnection | undefined

  try {
    // Get a connection from the pool
    connection = await pool.getConnection()

    // Start transaction
    await connection.beginTransaction()

    // Execute all queries
    const results: T[][] = []
    for (const { query, params } of queries) {
      const [rows] = await connection.execute(query, params)
      results.push(rows as T[])
    }

    // Commit transaction
    await connection.commit()

    // Return all results
    return results
  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback()
    }

    logger.error("Database transaction failed", "db", { queries }, error as Error)
    throw error
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release()
    }
  }
}

// Get a single record by ID
export const getById = async <T = any>(table: string, id: number | string, fields = "*"): Promise<T | null> => {
  const query = `SELECT ${fields} FROM ${table} WHERE id = ? LIMIT 1`
  const results = await executeQuery<T>(query, [id])
  return results.length > 0 ? results[0] : null
}

// Insert a record
export const insert = async <T = any>(table: string, data: Record<string, any>): Promise<number> => {
  const keys = Object.keys(data)
  const values = Object.values(data)
  const placeholders = keys.map(() => "?").join(", ")

  const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`
  const result = await executeQuery<{ insertId: number }>(query, values)

  return result[0]?.insertId
}

// Update a record
export const update = async (table: string, id: number | string, data: Record<string, any>): Promise<boolean> => {
  const keys = Object.keys(data)
  const values = Object.values(data)
  const setClause = keys.map((key) => `${key} = ?`).join(", ")

  const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`
  const result = await executeQuery(query, [...values, id])

  return true
}

// Delete a record
export const remove = async (table: string, id: number | string): Promise<boolean> => {
  const query = `DELETE FROM ${table} WHERE id = ?`
  await executeQuery(query, [id])
  return true
}

// Get paginated records
export const getPaginated = async <T = any>(
  table: string,
  page = 1,
  limit = 20,
  where = "",
  params: any[] = [],
  orderBy = "id DESC",
  fields = "*",
): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }> => {
  const offset = (page - 1) * limit
  const whereClause = where ? `WHERE ${where}` : ""

  // Get data
  const dataQuery = `
    SELECT ${fields} FROM ${table}
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `

  // Get total count
  const countQuery = `
    SELECT COUNT(*) as total FROM ${table}
    ${whereClause}
  `

  // Execute both queries
  const [data, countResult] = await Promise.all([
    executeQuery<T>(dataQuery, [...params, limit, offset]),
    executeQuery<{ total: number }>(countQuery, params),
  ])

  const total = countResult[0]?.total || 0
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  }
}
