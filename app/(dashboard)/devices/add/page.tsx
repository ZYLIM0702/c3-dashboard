"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { createDevice } from "@/lib/supabase-service"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Device name must be at least 2 characters.",
  }),
  type: z.string(),
  custom_type: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  altitude: z.coerce.number().optional(),
  firmware_version: z.string().optional(),
  description: z.string().optional(),
  // SDK connection fields
  use_sdk: z.boolean().default(false),
  sdk_key: z.string().optional(),
  sdk_endpoint: z.string().optional(),
  sdk_version: z.string().optional(),
  sdk_protocol: z.enum(["mqtt", "http", "websocket", "custom"]).optional(),
  sdk_custom_protocol: z.string().optional(),
})

export default function AddDevicePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "ground_node",
      latitude: 0,
      longitude: 0,
      altitude: 0,
      firmware_version: "",
      description: "",
      use_sdk: false,
      sdk_protocol: "mqtt",
    },
  })

  const watchType = form.watch("type")
  const watchUseSDK = form.watch("use_sdk")
  const watchSDKProtocol = form.watch("sdk_protocol")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Prepare device data
      const deviceData = {
        name: values.name,
        type: values.type === "custom" ? values.custom_type! : values.type,
        status: "active",
        location: {
          latitude: values.latitude,
          longitude: values.longitude,
          altitude: values.altitude || 0,
        },
        battery_level: 100,
        signal_strength: 100,
        firmware_version: values.firmware_version || "1.0.0",
        last_seen: new Date().toISOString(),
        metadata: {
          description: values.description,
          use_sdk: values.use_sdk,
          sdk_info: values.use_sdk
            ? {
                key: values.sdk_key,
                endpoint: values.sdk_endpoint,
                version: values.sdk_version,
                protocol: values.sdk_protocol === "custom" ? values.sdk_custom_protocol : values.sdk_protocol,
              }
            : null,
        },
      }

      // Create device in database
      await createDevice(deviceData)

      toast({
        title: "Device added successfully",
        description: `${values.name} has been added to the network.`,
      })
      router.push("/devices")
    } catch (error) {
      console.error("Error adding device:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add device. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const deviceTypeLabels: Record<string, string> = {
    ground_node: "Ground Node",
    marine_buoy: "Marine Buoy",
    wearable: "Wearable",
    drone: "Drone",
    seh: "Smart Emergency Helmet",
    lora_module: "LoRa Module",
    custom: "Custom Device Type",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Add New Device</h1>
        <p className="text-muted-foreground">
          Register a new device to the Humanitarian Unified Backbone (HUB) network
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="connectivity">Connectivity & SDK</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Device Information</CardTitle>
                  <CardDescription>Enter the basic details of the new device</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Device Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Ground Node G-043" {...field} />
                        </FormControl>
                        <FormDescription>A unique name to identify this device</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Device Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select device type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(deviceTypeLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>The type of device being added</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchType === "custom" && (
                    <FormField
                      control={form.control}
                      name="custom_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Device Type</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., water_quality_sensor" {...field} />
                          </FormControl>
                          <FormDescription>Enter a unique identifier for this custom device type</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="firmware_version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firmware Version</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., v2.3.1" {...field} />
                        </FormControl>
                        <FormDescription>Current firmware version of the device</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter additional details about this device"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Additional information about the device, its location, or purpose
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location">
              <Card>
                <CardHeader>
                  <CardTitle>Device Location</CardTitle>
                  <CardDescription>Specify where this device will be deployed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.000001" {...field} />
                          </FormControl>
                          <FormDescription>Decimal degrees (e.g., 3.1390)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.000001" {...field} />
                          </FormControl>
                          <FormDescription>Decimal degrees (e.g., 101.6869)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="altitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altitude (optional)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormDescription>In meters above sea level</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="h-[300px] w-full rounded-md bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Map visualization would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connectivity">
              <Card>
                <CardHeader>
                  <CardTitle>Connectivity & SDK</CardTitle>
                  <CardDescription>Configure how this device connects to the system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="use_sdk"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Use SDK Connection</FormLabel>
                          <FormDescription>Enable SDK-based connection for this device</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchUseSDK && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="sdk_key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SDK API Key</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter SDK API key" {...field} />
                            </FormControl>
                            <FormDescription>API key for authenticating with the SDK</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sdk_endpoint"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SDK Endpoint</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., https://api.hub.org/devices" {...field} />
                            </FormControl>
                            <FormDescription>The endpoint URL for SDK communication</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sdk_version"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SDK Version</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 1.0.0" {...field} />
                            </FormControl>
                            <FormDescription>Version of the SDK being used</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sdk_protocol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Communication Protocol</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select protocol" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mqtt">MQTT</SelectItem>
                                <SelectItem value="http">HTTP/REST</SelectItem>
                                <SelectItem value="websocket">WebSocket</SelectItem>
                                <SelectItem value="custom">Custom Protocol</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Protocol used for device communication</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchSDKProtocol === "custom" && (
                        <FormField
                          control={form.control}
                          name="sdk_custom_protocol"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Protocol</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., CoAP, LoRaWAN, etc." {...field} />
                              </FormControl>
                              <FormDescription>Specify the custom protocol used</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Device"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
