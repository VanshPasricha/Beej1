"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Sprout, MapPin, Phone, ArrowRight } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const cropOptions = [
  { id: "rice", name: "Rice", icon: "🌾" },
  { id: "wheat", name: "Wheat", icon: "🌾" },
  { id: "corn", name: "Corn", icon: "🌽" },
  { id: "tomato", name: "Tomato", icon: "🍅" },
  { id: "potato", name: "Potato", icon: "🥔" },
  { id: "onion", name: "Onion", icon: "🧅" },
  { id: "sugarcane", name: "Sugarcane", icon: "🎋" },
  { id: "cotton", name: "Cotton", icon: "🌿" },
]

const soilTypes = [
  { id: "clay", name: "Clay Soil", description: "Heavy, nutrient-rich soil that retains water well", icon: "🟤" },
  { id: "sandy", name: "Sandy Soil", description: "Light, well-draining soil with good aeration", icon: "🟨" },
  {
    id: "loamy",
    name: "Loamy Soil",
    description: "Balanced mix of sand, silt, and clay - ideal for most crops",
    icon: "🟫",
  },
  { id: "silt", name: "Silt Soil", description: "Fine particles with good water retention", icon: "🟩" },
  { id: "peaty", name: "Peaty Soil", description: "Organic-rich soil with high water retention", icon: "🟦" },
  { id: "chalky", name: "Chalky Soil", description: "Alkaline soil with good drainage", icon: "⚪" },
]

export default function ProfileSetupPage() {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState({
    farmerName: "",
    farmSize: "",
    location: "",
    phoneNumber: "",
    bio: "",
    cropsGrown: [] as string[],
    soilType: "", // Changed from sustainabilityFocus array to soilType string
  })
  const cities = [
    "Pune, Maharashtra",
    "Mumbai, Maharashtra",
    "Delhi, Delhi",
    "Bengaluru, Karnataka",
    "Hyderabad, Telangana",
    "Chennai, Tamil Nadu",
    "Kolkata, West Bengal",
    "Ahmedabad, Gujarat",
    "Jaipur, Rajasthan",
    "Lucknow, Uttar Pradesh",
    "Indore, Madhya Pradesh",
    "Other",
  ]
  const [locationMode, setLocationMode] = useState<'select'|'other'>('select')

  const handleCropToggle = (cropId: string) => {
    setProfile((prev) => ({
      ...prev,
      cropsGrown: prev.cropsGrown.includes(cropId)
        ? prev.cropsGrown.filter((id) => id !== cropId)
        : [...prev.cropsGrown, cropId],
    }))
  }

  const handleSoilTypeSelect = (soilId: string) => {
    setProfile((prev) => ({
      ...prev,
      soilType: soilId,
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // Client-side validation for farmSize
    if (!profile.farmSize || isNaN(Number(profile.farmSize)) || Number(profile.farmSize) <= 0) {
      alert('Please enter a valid farm size (number > 0).')
      return
    }
    try {
      setIsLoading(true)
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerName: profile.farmerName,
          farmSize: profile.farmSize,
          location: profile.location,
          phoneNumber: profile.phoneNumber,
          bio: profile.bio,
          cropsGrown: profile.cropsGrown,
          soilType: profile.soilType,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || res.statusText)
      }
      const data = await res.json()
      // Persist user id, name and location for later use
      try {
        localStorage.setItem('beejsetu-userId', String(data.userId))
        localStorage.setItem('beejsetu-userName', profile.farmerName)
        if (profile.location) localStorage.setItem('beejsetu-location', profile.location)
      } catch {}
      window.location.href = '/dashboard'
    } catch (e: any) {
      console.error('Profile submit failed', e)
      alert(e?.message || 'Failed to save profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profile.farmerName && profile.farmSize && profile.location
      case 2:
        return profile.cropsGrown.length > 0
      case 3:
        return profile.soilType // Updated validation for soil type
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 beejsetu-card-shadow">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Complete Your Profile</CardTitle>
          <p className="text-sm text-gray-600">Help us personalize your farming journey</p>
          {/* Progress indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step <= currentStep ? "bg-orange-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Farm Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Farm Information</h3>
              <div className="space-y-2">
                <Label htmlFor="farm-name" className="text-sm font-medium text-gray-700">
                  {t("farmerName")}
                </Label>
                <Input
                  id="farm-name"
                  placeholder="e.g., Green Valley Farm"
                  className="border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                  value={profile.farmerName}
                  onChange={(e) => setProfile({ ...profile, farmerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farm-size" className="text-sm font-medium text-gray-700">
                  {t("farmSize")}
                </Label>
                <Input
                  id="farm-size"
                  type="number"
                  placeholder="e.g., 5"
                  className="border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                  value={profile.farmSize}
                  onChange={(e) => setProfile({ ...profile, farmSize: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  {t("location")}
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  <Select
                    value={locationMode === 'other' ? 'Other' : (profile.location || '')}
                    onValueChange={(val) => {
                      if (val === 'Other') {
                        setLocationMode('other')
                        setProfile({ ...profile, location: '' })
                      } else {
                        setLocationMode('select')
                        setProfile({ ...profile, location: val })
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {locationMode === 'other' && (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="City, State"
                        className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  {t("phoneNumber")}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                    value={profile.phoneNumber}
                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          {/* Step 2: Crops Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("cropsGrown")}</h3>
              <p className="text-sm text-gray-600 mb-4">Select all crops you currently grow or plan to grow</p>
              <div className="grid grid-cols-2 gap-3">
                {cropOptions.map((crop) => (
                  <div
                    key={crop.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      profile.cropsGrown.includes(crop.id)
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleCropToggle(crop.id)}
                  >
                    <Checkbox
                      checked={profile.cropsGrown.includes(crop.id)}
                      onChange={() => handleCropToggle(crop.id)}
                    />
                    <span className="text-xl">{crop.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{crop.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Step 3: Soil Type & Bio */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Soil Type</h3>
                <p className="text-sm text-gray-600 mb-4">What type of soil do you primarily work with?</p>
                <div className="grid grid-cols-1 gap-3">
                  {soilTypes.map((soil) => (
                    <div
                      key={soil.id}
                      className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        profile.soilType === soil.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSoilTypeSelect(soil.id)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`w-4 h-4 rounded-full border-2 transition-colors ${
                            profile.soilType === soil.id ? "border-orange-500 bg-orange-500" : "border-gray-300"
                          }`}
                        >
                          {profile.soilType === soil.id && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                      </div>
                      <span className="text-xl flex-shrink-0">{soil.icon}</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700 block">{soil.name}</span>
                        <span className="text-xs text-gray-500">{soil.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                  {t("bio")}
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your farming journey, experience, and goals..."
                  className="border-gray-200 focus:border-orange-300 focus:ring-orange-200 min-h-[100px]"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>
            </div>
          )}
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Back
            </Button>
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? "Setting up..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}