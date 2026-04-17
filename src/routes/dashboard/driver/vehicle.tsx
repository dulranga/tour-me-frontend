import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { toast } from 'sonner'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export const Route = createFileRoute('/dashboard/driver/vehicle')({
  component: DriverVehiclePage,
})

type DriverUser = {
  userId: number
  name: string
  email: string
  userType: string
  licenseNumber: string
  vehicleDetails: string
  registrationDate: string
}

function DriverVehiclePage() {
  const { user } = useRouteContext({ from: '/dashboard' })
  const queryClient = useQueryClient()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [vehicleDetailsInput, setVehicleDetailsInput] = useState('')

  // Fetch user/driver data
  const {
    data: driverData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['driver-profile', user.userId],
    queryFn: () => api<DriverUser>(`/users/${user.userId}`),
  })

  // Set initial input value when data loads
  useEffect(() => {
    if (driverData?.vehicleDetails) {
      setVehicleDetailsInput(driverData.vehicleDetails)
    }
  }, [driverData])

  // Mutation for updating vehicle
  const updateVehicleMutation = useMutation({
    mutationFn: (newVehicleDetails: string) =>
      api(`/users/${user.userId}/vehicle`, {
        method: 'PUT',
        body: newVehicleDetails,
      }),
    onSuccess: () => {
      toast.success('Vehicle details updated successfully')
      setIsEditDialogOpen(false)
      void queryClient.invalidateQueries({
        queryKey: ['driver-profile', user.userId],
      })
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update vehicle',
      )
    },
  })

  const handleSaveVehicle = () => {
    if (!vehicleDetailsInput.trim()) {
      toast.error('Please enter vehicle details')
      return
    }
    updateVehicleMutation.mutate(vehicleDetailsInput)
  }

  return (
    <DashboardShell
      title="Vehicle"
      subtitle="Manage vehicle information and maintenance reminders."
      roleLabel="Driver"
      navItems={driverNavItems}
    >
      {isLoading && (
        <p className="text-sm text-text-muted">
          Loading vehicle information...
        </p>
      )}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error ? error.message : 'Failed to load vehicle'}
        </p>
      )}
      {!isLoading && !isError && driverData && (
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm text-text-secondary">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">License number</span>
                  <span className="font-semibold text-text-primary">
                    {driverData.licenseNumber}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-text-muted">Vehicle details</span>
                  <span className="font-semibold text-text-primary text-right">
                    {driverData.vehicleDetails || 'No vehicle details provided'}
                  </span>
                </div>
              </div>
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full">Edit vehicle</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit vehicle details</DialogTitle>
                    <DialogDescription>
                      Update the vehicle details associated with your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="vehicle-details">Vehicle details</Label>
                      <Input
                        id="vehicle-details"
                        placeholder="e.g., Toyota Camry, Silver, 4 seats, License: ABC123"
                        value={vehicleDetailsInput}
                        onChange={(e) => setVehicleDetailsInput(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      onClick={handleSaveVehicle}
                      disabled={updateVehicleMutation.isPending}
                    >
                      {updateVehicleMutation.isPending
                        ? 'Saving...'
                        : 'Save changes'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </section>
      )}
    </DashboardShell>
  )
}
