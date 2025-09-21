"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/hooks/use-translation"
import { TranslationWrapper } from "@/components/translation-wrapper"
import { User, MapPin, Phone, Mail, Edit3, Save, X } from "lucide-react"
import { useEffect } from "react"

export default function ProfilePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: "",
    farmLocation: "",
    farmSize: "",
    soilType: "",
    primaryCrops: "",
    experience: "",
    bio: "",
  })

  const [editData, setEditData] = useState(profileData)

  // Static mock data mode (original version); no DB fetch
  // Load from database if user id is present
  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('beejsetu-userId') : null
    if (!id) return
    ;(async () => {
      try {
        const res = await fetch(`/api/users/${id}`)
        if (!res.ok) return
        const data = await res.json()
        const user = data?.user || {}
        const prof = data?.profile || {}
        let soilType = ""
        let primaryCrops = ""
        let bio = ""
        try {
          if (prof?.crop_types) {
            const parsed = JSON.parse(prof.crop_types)
            soilType = parsed?.soilType || ""
            bio = parsed?.bio || ""
            if (Array.isArray(parsed?.crops)) primaryCrops = parsed.crops.join(", ")
          }
        } catch {}
        const nextData = {
          name: user?.name || "",
          phone: user?.mobile || "",
          email: user?.email || "",
          farmLocation: prof?.location || "",
          farmSize: prof?.land_size != null ? String(prof.land_size) : "",
          soilType,
          primaryCrops,
          experience: prof?.farming_experience || "",
          bio,
        }
        setProfileData(nextData)
        setEditData(nextData)
      } catch (e) {
        console.warn('Failed to load profile:', e)
      }
    })()
  }, [])

  const handleSave = () => {
    setProfileData(editData)
    setIsEditing(false)
    // In real app, save to database here
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
  }

  const soilTypes = ["काली मिट्टी", "लाल मिट्टी", "जलोढ़ मिट्टी", "रेतीली मिट्टी", "चिकनी मिट्टी", "दोमट मिट्टी"]

  return (
    <TranslationWrapper>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">प्रोफाइल</h1>
                <p className="text-gray-600">अपनी जानकारी देखें और अपडेट करें</p>
              </div>
            </div>

            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                <Edit3 className="w-4 h-4 mr-2" />
                संपादित करें
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  सेव करें
                </Button>
                <Button onClick={handleCancel} variant="outline" className="border-gray-300 bg-transparent">
                  <X className="w-4 h-4 mr-2" />
                  रद्द करें
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  व्यक्तिगत जानकारी
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">नाम</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded-md">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">फोन नंबर</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded-md flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {profileData.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">ईमेल</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded-md flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {profileData.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location">खेत का स्थान</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={editData.farmLocation}
                        onChange={(e) => setEditData({ ...editData, farmLocation: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded-md flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        {profileData.farmLocation}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">बायो</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{profileData.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Farm Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  खेत की जानकारी
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="farmSize">खेत का आकार</Label>
                  {isEditing ? (
                    <Input
                      id="farmSize"
                      value={editData.farmSize}
                      onChange={(e) => setEditData({ ...editData, farmSize: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{profileData.farmSize}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="soilType">मिट्टी का प्रकार</Label>
                  {isEditing ? (
                    <Select
                      value={editData.soilType}
                      onValueChange={(value) => setEditData({ ...editData, soilType: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {soilTypes.map((soil) => (
                          <SelectItem key={soil} value={soil}>
                            {soil}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{profileData.soilType}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="crops">मुख्य फसलें</Label>
                  {isEditing ? (
                    <Input
                      id="crops"
                      value={editData.primaryCrops}
                      onChange={(e) => setEditData({ ...editData, primaryCrops: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{profileData.primaryCrops}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="experience">अनुभव</Label>
                  {isEditing ? (
                    <Input
                      id="experience"
                      value={editData.experience}
                      onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded-md">{profileData.experience}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TranslationWrapper>
  )
}
