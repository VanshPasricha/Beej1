"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, CreditCard, ArrowLeft, ArrowRight } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"
import { TranslationWrapper } from "@/components/translation-wrapper"
import Image from "next/image"
import Logo from "@/components/Logo"
 
export default function AuthPage() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"input" | "otp">("input")
  const [authType, setAuthType] = useState<"mobile" | "aadhar">("mobile")
  const [countryCode, setCountryCode] = useState("+91")
  const [formData, setFormData] = useState({
    mobile: "",
    aadhar: "",
    name: "",
    otp: "",
  })
  const [generatedOtp, setGeneratedOtp] = useState("123456") // default OTP

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // For testing: OTP defaulted to "123456"
    setGeneratedOtp("123456")

    // Log OTP for development only
    console.log("Generated OTP:", "123456")

    setTimeout(() => {
      setIsLoading(false)
      setStep("otp")
    }, 1500)
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.otp === generatedOtp) {
      setTimeout(() => {
        setIsLoading(false)
        window.location.href = "/profile-setup"
      }, 1500)
    } else {
      setIsLoading(false)
      alert("Invalid OTP, please try again.")
    }
  }

  const handleBack = () => {
    setStep("input")
    setFormData({ ...formData, otp: "" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-xl border-0 beejsetu-card-shadow">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 overflow-hidden rounded-full flex items-center justify-center">
              <Logo size={64} />
            </div>
            <TranslationWrapper>
              <CardTitle className="text-2xl font-bold text-gray-900">{t("appName")}</CardTitle>
              <p className="text-sm text-gray-600">{t("tagline")}</p>
            </TranslationWrapper>
          </CardHeader>

          <CardContent>
            <TranslationWrapper>
              {step === "input" ? (
                <>
                  <div className="mb-6">
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">Choose Authentication Method</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAuthType("mobile")}
                        className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                          authType === "mobile"
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Mobile
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthType("aadhar")}
                        className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                          authType === "aadhar"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Aadhar
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSendOTP} className="space-y-4">
                    {authType === "mobile" ? (
                      <div className="space-y-2">
                        <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                          Mobile Number
                        </Label>
                        <div className="flex space-x-2">
                          <select
                            className="border-gray-300 rounded px-3"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            aria-label="Country code"
                          >
                            <option value="+91">+91 (India)</option>
                            <option value="+1">+1 (USA)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+61">+61 (Australia)</option>
                            <option value="+81">+81 (Japan)</option>
                            {/* Add more country codes as needed */}
                          </select>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="mobile"
                              type="tel"
                              placeholder="98765 43210"
                              className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                              value={formData.mobile}
                              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="aadhar" className="text-sm font-medium text-gray-700">
                          Aadhar Number
                        </Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="aadhar"
                            type="text"
                            placeholder="1234 5678 9012"
                            className="pl-10 border-gray-200 focus:border-green-300 focus:ring-green-200"
                            value={formData.aadhar}
                            onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className={`w-full text-white ${
                        authType === "mobile" ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Verify OTP</h3>
                    <p className="text-sm text-gray-600">
                      Enter the 6-digit code sent to your {authType === "mobile" ? "mobile number" : "registered mobile"}
                    </p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {authType === "mobile" ? `${countryCode} ${formData.mobile}` : `****${formData.aadhar.slice(-4)}`}
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                        OTP Code
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        className="text-center text-lg tracking-widest border-gray-200 focus:border-orange-300 focus:ring-orange-200"
                        value={formData.otp}
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                        maxLength={6}
                        required
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        ← Change Number
                      </button>
                      <button type="button" className="text-orange-600 hover:text-orange-700 transition-colors">
                        Resend OTP
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className={`w-full ${authType === "mobile" ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"} text-white`}
                      disabled={isLoading || formData.otp.length !== 6}
                    >
                      {isLoading ? "Verifying..." : "Verify & Continue"}
                    </Button>
                  </form>
                </>
              )}
            </TranslationWrapper>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
