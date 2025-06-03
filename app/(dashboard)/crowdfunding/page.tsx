"use client"

import { useState } from "react"
import { Heart, Users, Calendar, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Campaign type definition
type Campaign = {
  id: string
  title: string
  description: string
  organizer: string
  raised: number
  goal: number
  donors: number
  daysLeft: number
  category: string
  image?: string
  isUrgent?: boolean
  isVerified?: boolean
}

// Admin Crowdfunding Management Page
export default function CrowdfundingAdminPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "camp-001",
      title: "Flood Relief for Kelantan",
      description:
        "Help provide emergency shelter, food, and supplies to families affected by the recent floods in Kelantan.",
      organizer: "Malaysian Red Crescent Society",
      raised: 45750,
      goal: 80000,
      donors: 542,
      daysLeft: 5,
      category: "Shelter",
      isUrgent: true,
      isVerified: true,
      image: "https://www.theborneopost.com/newsimages/2022/09/malaysian-family-cheap-sale.jpg",
    },
    {
      id: "camp-002",
      title: "Medical Aid for Sabah Villages",
      description:
        "Support mobile clinics delivering urgent medical care to rural communities in Sabah.",
      organizer: "Mercy Malaysia",
      raised: 23920,
      goal: 40000,
      donors: 278,
      daysLeft: 3,
      category: "Medical",
      isUrgent: true,
      isVerified: true,
      image: "https://codeblue.galencentre.org/wp-content/uploads/2020/09/Sarawak-FDS-compressed_WHO.jpg",
    },
    {
      id: "camp-003",
      title: "Clean Water for Orang Asli",
      description: "Help install water filtration systems for Orang Asli villages in Pahang.",
      organizer: "Water For Malaysia",
      raised: 13400,
      goal: 25000,
      donors: 212,
      daysLeft: 7,
      category: "Water",
      isVerified: true,
      image: "https://static.wixstatic.com/media/3031f2_20f28ca8d6874542821336c31c3cec46~mv2.webp/v1/fill/w_700,h_525,al_c/3031f2_20f28ca8d6874542821336c31c3cec46~mv2.webp",
    },
    {
      id: "camp-004",
      title: "School Rebuilding in Penang",
      description: "Support the reconstruction of schools damaged by landslides in Penang.",
      organizer: "Education For All Malaysia",
      raised: 38400,
      goal: 100000,
      donors: 367,
      daysLeft: 14,
      category: "Education",
      isVerified: true,
      image: "https://www.wfp.org/sites/default/files/styles/gallery_embed_big/public/2021-11/211115_Ecole_Lahatte_haute%20def_Franckyle%20Augustin_2.jpg?itok=lPHDag2R",
    },
    {
      id: "camp-005",
      title: "Emergency Communications for Sarawak",
      description: "Help deploy emergency communication equipment to restore connectivity in Sarawak's rural areas.",
      organizer: "Tech Relief Malaysia",
      raised: 22800,
      goal: 30000,
      donors: 303,
      daysLeft: 2,
      category: "Technology",
      isUrgent: true,
      image: "https://www.sarawaktribune.com/wp-content/uploads/2022/03/KCH-khirudin-comm-2503-alv-2.jpeg",
    },
    {
      id: "camp-006",
      title: "Food Supplies for B40 Families",
      description: "Distribute essential food packages to B40 families in Kuala Lumpur.",
      organizer: "Food Bank Malaysia",
      raised: 10500,
      goal: 20000,
      donors: 120,
      daysLeft: 10,
      category: "Food",
      image: "https://news.actschurch.org/wp-content/uploads/2021/08/Food-Items-Seline-Lee-1024x766.jpg",
      isVerified: true,
    },
    {
      id: "camp-007",
      title: "Solar Power for Rural Schools",
      description: "Install solar panels in rural schools to ensure uninterrupted learning.",
      organizer: "Green Energy Initiative",
      raised: 8000,
      goal: 30000,
      donors: 60,
      daysLeft: 20,
      category: "Energy",
      image: "https://solarnaturally.com.au/wp-content/uploads/2018/01/how-do-solar-panels-work.jpg",
      isUrgent: false,
      isVerified: true,
    },
  ])
  const [editModal, setEditModal] = useState<{ open: boolean; campaign: Campaign | null }>({ open: false, campaign: null })

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getProgressColor = (raised: number, goal: number) => {
    const percentage = (raised / goal) * 100
    if (percentage >= 90) return "bg-green-600"
    if (percentage >= 50) return "bg-blue-600"
    return "bg-orange-600"
  }
  const formatCurrency = (amount: number) => `RM${amount.toLocaleString("en-MY", { minimumFractionDigits: 0 })}`
  const handleEdit = (id: string) => {
    const campaign = campaigns.find((c) => c.id === id) || null
    setEditModal({ open: true, campaign })
  }
  const handleEditSave = () => {
    if (!editModal.campaign) return
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === editModal.campaign!.id ? { ...editModal.campaign! } : c
      )
    )
    setEditModal({ open: false, campaign: null })
  }
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setEditModal((prev) => ({
      ...prev,
      campaign: prev.campaign
        ? {
            ...prev.campaign,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
          }
        : null,
    }))
  }
  const handleEditClose = () => setEditModal({ open: false, campaign: null })
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id))
    }
  }
  const handleView = (id: string) => {
    alert(`View details for campaign ${id}`)
  }
  const handleAdd = () => {
    alert("Add new campaign (not implemented)")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Crowdfunding Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Administer disaster relief and community campaigns</p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search campaigns..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" onClick={handleAdd} />
        </Button>
      </div>

      {/* Campaigns Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Organizer</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Raised</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Donors</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Days Left</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="px-4 py-2">
                  {campaign.image ? (
                    <img src={campaign.image} alt={campaign.title} className="h-40 w-40 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-2 font-medium">{campaign.title}</td>
                <td className="px-4 py-2">{campaign.organizer}</td>
                <td className="px-4 py-2">{formatCurrency(campaign.raised)}</td>
                <td className="px-4 py-2">{formatCurrency(campaign.goal)}</td>
                <td className="px-4 py-2">{campaign.donors}</td>
                <td className="px-4 py-2">{campaign.daysLeft}</td>
                <td className="px-4 py-2">
                  <Badge color="outline">{campaign.category}</Badge>
                </td>
                <td className="px-4 py-2">
                  {campaign.isUrgent && <Badge color="destructive">Urgent</Badge>}
                  {campaign.isVerified && (
                    <Badge color="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ml-1">Verified</Badge>
                  )}
                </td>
                <td className="px-4 py-2 space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => handleView(campaign.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => handleEdit(campaign.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(campaign.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {filteredCampaigns.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No campaigns found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModal.open && editModal.campaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Campaign</h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium">Title</span>
                <Input name="title" value={editModal.campaign.title} onChange={handleEditChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Description</span>
                <Input name="description" value={editModal.campaign.description} onChange={handleEditChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Organizer</span>
                <Input name="organizer" value={editModal.campaign.organizer} onChange={handleEditChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Image URL</span>
                <Input name="image" value={editModal.campaign.image || ''} onChange={handleEditChange} />
              </label>
              <div className="flex space-x-2">
                <label className="block flex-1">
                  <span className="text-sm font-medium">Raised</span>
                  <Input name="raised" type="number" value={editModal.campaign.raised} onChange={handleEditChange} />
                </label>
                <label className="block flex-1">
                  <span className="text-sm font-medium">Goal</span>
                  <Input name="goal" type="number" value={editModal.campaign.goal} onChange={handleEditChange} />
                </label>
              </div>
              <div className="flex space-x-2">
                <label className="block flex-1">
                  <span className="text-sm font-medium">Donors</span>
                  <Input name="donors" type="number" value={editModal.campaign.donors} onChange={handleEditChange} />
                </label>
                <label className="block flex-1">
                  <span className="text-sm font-medium">Days Left</span>
                  <Input name="daysLeft" type="number" value={editModal.campaign.daysLeft} onChange={handleEditChange} />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium">Category</span>
                <Input name="category" value={editModal.campaign.category} onChange={handleEditChange} />
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="isUrgent" checked={editModal.campaign.isUrgent || false} onChange={handleEditChange} />
                  <span>Urgent</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="isVerified" checked={editModal.campaign.isVerified || false} onChange={handleEditChange} />
                  <span>Verified</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={handleEditClose}>Cancel</Button>
              <Button onClick={handleEditSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
