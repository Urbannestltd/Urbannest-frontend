import dashboardIcon from "@/app/assets/icons/tenant-sidebar-icons/dashboard-icon.svg"
import leaseIcon from "@/app/assets/icons/tenant-sidebar-icons/lease-icon.svg"
import maintenanceIcon from "@/app/assets/icons/tenant-sidebar-icons/maintenance-icon.svg"
import visitorIcon from "@/app/assets/icons/tenant-sidebar-icons/vistor-icon.svg"
import { userData } from "./model"

export const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/tenant/dashboard",
    icon: dashboardIcon,
    value: "dashboard",
  },
  {
    title: "Lease & Payments",
    href: "/tenant/lease",
    icon: leaseIcon,
    value: "lease",
  },
  {
    title: "Maintenance & Issues",
    href: "/tenant/maintenance",
    icon: maintenanceIcon,
    value: "maintenance",
  },
  {
    title: "Visitor Management",
    href: "/tenant/visitors",
    icon: visitorIcon,
    value: "visitors",
  },
]

export const VistorData: userData = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "lVjRt@example.com",
  rent: "₦12,000,000",
  visitors: [
    {
      id: 1,
      name: "John Doe",
      email: "lVjRt@example.com",
      phone: "08123456789",
      status: "checked-out",
      access: "one-off",
      timeIn: "10:00 AM",
      timeOut: "12:00 PM",
    },
    {
      id: 2,
      name: "Rose Doe",
      email: "lVjRt@example.com",
      phone: "08123456789",
      status: "checked-in",
      access: "one-off",
      timeIn: "10:00 AM",
      timeOut: "12:00 PM",
    },
    {
      id: 3,
      name: "Temi Kalaro",
      email: "lVjRt@example.com",
      phone: "08123456789",
      status: "checked-in",
      access: "one-off",
      timeIn: "10:00 AM",
      timeOut: "12:00 PM",
    },
  ],
}
