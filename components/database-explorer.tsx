"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase-service"

export function DatabaseExplorer() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("tables")
  const [tables, setTables] = useState<string[]>([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [tableData, setTableData] = useState<any[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [sqlQuery, setSqlQuery] = useState("")
  const [queryResult, setQueryResult] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true)
        const supabase = getSupabaseClient()

        // Get list of tables
        const { data, error } = await supabase.rpc("get_tables")

        if (error) throw error

        if (data && Array.isArray(data)) {
          setTables(data)
        }
      } catch (error) {
        console.error("Error fetching tables:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load database tables.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTables()
  }, [toast])

  const fetchTableData = async (tableName: string) => {
    try {
      setLoading(true)
      setSelectedTable(tableName)

      const supabase = getSupabaseClient()

      // Get table data
      const { data, error } = await supabase.from(tableName).select("*").limit(100)

      if (error) throw error

      setTableData(data || [])

      // Get column information
      if (data && data.length > 0) {
        const columnNames = Object.keys(data[0])
        setColumns(columnNames)
      } else {
        // If no data, try to get column information from the database
        const { data: columnData, error: columnError } = await supabase.rpc("get_columns", { table_name: tableName })

        if (columnError) throw columnError

        if (columnData && Array.isArray(columnData)) {
          setColumns(columnData)
        }
      }
    } catch (error) {
      console.error(`Error fetching data for table ${tableName}:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load data for table ${tableName}.`,
      })
    } finally {
      setLoading(false)
    }
  }

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "SQL query cannot be empty.",
      })
      return
    }

    try {
      setLoading(true)
      const supabase = getSupabaseClient()

      // Execute the SQL query
      const { data, error } = await supabase.rpc("execute_sql", { query: sqlQuery })

      if (error) throw error

      setQueryResult(data || [])

      toast({
        title: "Query executed",
        description: "SQL query executed successfully.",
      })
    } catch (error) {
      console.error("Error executing SQL query:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to execute SQL query. Check your syntax and permissions.",
      })
      setQueryResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Explorer</CardTitle>
        <CardDescription>Explore and query the system database</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="query">SQL Query</TabsTrigger>
          </TabsList>

          <TabsContent value="tables" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Tables</h3>
                {loading && !selectedTable ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tables.map((table) => (
                      <Button
                        key={table}
                        variant={selectedTable === table ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => fetchTableData(table)}
                      >
                        {table}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-3 border rounded-md p-4">
                {selectedTable ? (
                  <>
                    <h3 className="text-lg font-medium mb-2">Table: {selectedTable}</h3>
                    {loading ? (
                      <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {columns.map((column) => (
                                <TableHead key={column}>{column}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tableData.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                  No data found
                                </TableCell>
                              </TableRow>
                            ) : (
                              tableData.map((row, index) => (
                                <TableRow key={index}>
                                  {columns.map((column) => (
                                    <TableCell key={column}>
                                      {typeof row[column] === "object"
                                        ? JSON.stringify(row[column])
                                        : String(row[column] ?? "")}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-40 text-muted-foreground">
                    Select a table to view its data
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="query" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">SQL Query</h3>
                <Textarea
                  placeholder="Enter your SQL query here..."
                  className="min-h-[200px] font-mono"
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={executeQuery} disabled={loading}>
                  {loading ? "Executing..." : "Execute Query"}
                </Button>
              </div>

              {queryResult !== null && (
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Query Result</h3>
                  {Array.isArray(queryResult) && queryResult.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(queryResult[0]).map((column) => (
                              <TableHead key={column}>{column}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queryResult.map((row, index) => (
                            <TableRow key={index}>
                              {Object.keys(row).map((column) => (
                                <TableCell key={column}>
                                  {typeof row[column] === "object"
                                    ? JSON.stringify(row[column])
                                    : String(row[column] ?? "")}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">Query executed successfully, but returned no results</div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
