"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Search,
  Calendar,
  MapPin,
  IndianRupee,
  FileText,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Bookmark,
  BookmarkCheck,
  Users,
  TrendingUp,
  Award,
  Banknote,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/contexts/language-context"

const governmentSchemes = [
  {
    id: 1,
    title: "PM-KISAN Scheme",
    description: "Direct income support of ₹6,000 per year to small and marginal farmers",
    fullDescription:
      "The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme that provides income support to all landholding farmers' families across the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities as well as domestic needs.",
    t: {
      hi: {
        title: "पीएम-किसान योजना",
        description: "छोटे और सीमांत किसानों को प्रति वर्ष ₹6,000 की आय सहायता",
        fullDescription: "प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान) एक केंद्रीय क्षेत्र की योजना है जो देश भर के सभी कृषक परिवारों को कृषि व संबद्ध गतिविधियों तथा घरेलू आवश्यकताओं के लिए आय सहायता प्रदान करती है।",
      },
      ml: {
        title: "പി.എം-കിസാന്‍ പദ്ധതി",
        description: "ചെറു, കിടായ്മ കർഷകർക്കു പ്രതിവർഷം ₹6,000 വരുമാന സഹായം",
        fullDescription: "പ്രധാനമന്ത്രി കിസാൻ സമ്മാൻ നിധി (PM-KISAN) രാജ്യമൊട്ടാകെയുള്ള ഭൂമി ഉടമസ്ഥ കർഷക കുടുംബങ്ങൾക്ക് കൃഷി, അനുബന്ധ മേഖലകൾക്കും ഗൃഹാവശ്യങ്ങൾക്കുമുള്ള ചെലവുകൾക്കായി വരുമാന സഹായം നൽകുന്ന കേന്ദ്ര മേഖലയിലെ പദ്ധതിയാണ്.",
      },
    },
    category: "Income Support",
    amount: "₹6,000/year",
    eligibility: ["Small and marginal farmers", "Landholding up to 2 hectares", "Valid Aadhaar card"],
    benefits: [
      "₹2,000 every 4 months",
      "Direct bank transfer",
      "No paperwork required after registration",
      "Covers all crops and farming activities",
    ],
    applicationDeadline: "March 31, 2025",
    startDate: "February 1, 2019",
    status: "active",
    region: "All India",
    department: "Ministry of Agriculture & Farmers Welfare",
    applicableStates: ["All States"],
    cropsApplicable: ["All Crops"],
    documentsRequired: ["Aadhaar Card", "Bank Account Details", "Land Records"],
    applicationProcess: "Online through PM-KISAN portal or Common Service Centers",
    contactInfo: "1800-115-526 (Toll Free)",
    isBookmarked: true,
    applicants: 125000,
    successRate: 92,
    avgProcessingTime: "15 days",
    lastUpdated: "2025-01-15",
    officialUrl: "https://pmkisan.gov.in/",
  },
  {
    id: 2,
    title: "Soil Health Card Scheme",
    description: "Free soil testing and nutrient recommendations for farmers",
    fullDescription:
      "The Soil Health Card Scheme aims to issue soil health cards to farmers which will carry crop-wise recommendations of nutrients and fertilizers required for the individual farms to help farmers improve productivity through judicious use of inputs.",
    t: {
      hi: {
        title: "मृदा स्वास्थ्य कार्ड योजना",
        description: "किसानों के लिए मुफ्त मृदा परीक्षण और पोषण सिफारिशें",
        fullDescription: "मृदा स्वास्थ्य कार्ड योजना का उद्देश्य किसानों को फसलवार उर्वरक/पोषक तत्वों की सिफारिशों वाला स्वास्थ्य कार्ड उपलब्ध कराना है ताकि इनपुट का सुविचारित उपयोग कर उत्पादकता बढ़ाई जा सके।",
      },
      ml: {
        title: "മണ്ണിന്റെ ആരോഗ്യ കാർഡ് പദ്ധതി",
        description: "കർഷകർക്ക് സൗജന്യ മണ്ണ് പരിശോധനയും പോഷക ശുപാർശകളും",
        fullDescription: "മണ്ണിന്റെ ആരോഗ്യ കാർഡ് പദ്ധതി കർഷകർക്ക് ഓരോ കൃഷിയിടത്തിനും ആവശ്യമായ വളം/പോഷകങ്ങളുടെ ശുപാർശ ഉൾപ്പെട്ട കാർഡ് നൽകുകയാണ് ലക്ഷ്യമിടുന്നത്, ഇന്‍പുട്ടുകളുടെ യുക്തിപരമായ ഉപയോഗത്തിലൂടെ ഉല്‍പാദനക്ഷമത വര്‍ധിപ്പിക്കാന്‍.",
      },
    },
    category: "Soil Management",
    amount: "Free",
    eligibility: ["All farmers", "Valid land documents", "Soil samples required"],
    benefits: [
      "Free soil testing",
      "Customized fertilizer recommendations",
      "Improved crop yield",
      "Reduced input costs",
    ],
    applicationDeadline: "April 15, 2025",
    startDate: "February 19, 2015",
    status: "active",
    region: "All India",
    department: "Ministry of Agriculture & Farmers Welfare",
    applicableStates: ["All States"],
    cropsApplicable: ["All Crops"],
    documentsRequired: ["Land Records", "Aadhaar Card", "Soil Sample"],
    applicationProcess: "Through Agriculture Extension Officer or online portal",
    contactInfo: "State Agriculture Department",
    isBookmarked: false,
    applicants: 89000,
    successRate: 88,
    avgProcessingTime: "21 days",
    lastUpdated: "2025-01-12",
    officialUrl: "https://soilhealth.dac.gov.in/",
  },
  {
    id: 3,
    title: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme providing financial support against crop loss",
    fullDescription:
      "PMFBY aims to provide insurance coverage and financial support to the farmers in the event of failure of any of the notified crop as a result of natural calamities, pests & diseases.",
    t: {
      hi: {
        title: "प्रधानमंत्री फसल बीमा योजना",
        description: "फसल हानि के विरुद्ध वित्तीय सहायता प्रदान करने वाली बीमा योजना",
        fullDescription: "पीएमएफबीवाई का उद्देश्य प्राकृतिक आपदाओं, कीट/रोगों से फसल नष्ट होने पर किसानों को बीमा कवरेज और वित्तीय सहायता प्रदान करना है।",
      },
      ml: {
        title: "പ്രധാനമന്ത്രി ഫസൽ ബീമ പദ്ധതി",
        description: "വിള നാശത്തിനെതിരെ സാമ്പത്തിക സഹായം നൽകുന്ന വിള ഇൻഷുറൻസ് പദ്ധതി",
        fullDescription: "PMFBY യുടെ ലക്ഷ്യം പ്രകൃതി ദുരന്തങ്ങൾ, കീടങ്ങൾ, രോഗങ്ങൾ എന്നിവ മൂലം അറിയിപ്പുകിട്ടിയ വിളകൾ പരാജയപ്പെട്ടാൽ കർഷകർക്ക് ഇൻഷുറൻസ് സംരക്ഷണവും സാമ്പത്തിക സഹായവും നൽകുന്നതാണ്.",
      },
    },
    category: "Insurance",
    amount: "Up to ₹2,00,000",
    eligibility: ["All farmers", "Notified crops only", "Premium payment required"],
    benefits: [
      "Coverage against natural calamities",
      "Low premium rates",
      "Quick claim settlement",
      "Technology-enabled services",
    ],
    applicationDeadline: "June 30, 2025",
    startDate: "January 13, 2016",
    status: "active",
    region: "All India",
    department: "Ministry of Agriculture & Farmers Welfare",
    applicableStates: ["All States"],
    cropsApplicable: ["Rice", "Wheat", "Cotton", "Sugarcane", "Oilseeds"],
    documentsRequired: ["Aadhaar Card", "Bank Account", "Land Records", "Sowing Certificate"],
    applicationProcess: "Through banks, CSCs, or insurance companies",
    contactInfo: "1800-180-1551",
    isBookmarked: true,
    applicants: 156000,
    successRate: 85,
    avgProcessingTime: "30 days",
    lastUpdated: "2025-01-10",
    officialUrl: "https://pmfby.gov.in/",
  },
  {
    id: 4,
    title: "Kisan Credit Card Scheme",
    description: "Credit facility for farmers to meet their agricultural needs",
    fullDescription:
      "KCC provides adequate and timely credit support from the banking system under a single window with flexible and simplified procedure to the farmers for their cultivation and other needs.",
    t: {
      hi: {
        title: "किसान क्रेडिट कार्ड योजना",
        description: "कृषि आवश्यकताओं के लिए किसानों हेतु ऋण सुविधा",
        fullDescription: "केसीसी एकल खिड़की के तहत सरल प्रक्रिया के साथ खेती और अन्य आवश्यकताओं के लिए बैंकों से समय पर ऋण सहायता प्रदान करता है।",
      },
      ml: {
        title: "കിസാൻ ക്രെഡിറ്റ് കാർഡ് പദ്ധതി",
        description: "കർഷകർക്ക് കൃഷി ആവശ്യങ്ങൾക്കായി ക്രെഡിറ്റ് സൗകര്യം",
        fullDescription: "കെ.സി.സി. ഒരു സിംഗിൾ വിൻഡോ സംവിധാനത്തിലൂടെ ലളിതമായ നടപടിക്രമത്തോടെ കർഷകർക്ക് കൃഷിക്കും മറ്റു ആവശ്യങ്ങൾക്കുമായി ബാങ്കിംഗ് സംവിധാനത്തിൽ നിന്ന് സമയബന്ധിത വായ്പാ പിന്തുണ നൽകുന്നു.",
      },
    },
    category: "Credit",
    amount: "Up to ₹3,00,000",
    eligibility: ["All farmers", "Good credit history", "Valid land documents"],
    benefits: ["Easy access to credit", "Flexible repayment", "Insurance coverage", "ATM facility"],
    applicationDeadline: "Ongoing",
    startDate: "August 1998",
    status: "active",
    region: "All India",
    department: "Ministry of Agriculture & Farmers Welfare",
    applicableStates: ["All States"],
    cropsApplicable: ["All Crops"],
    documentsRequired: ["Aadhaar Card", "PAN Card", "Land Documents", "Income Proof"],
    applicationProcess: "Through banks and financial institutions",
    contactInfo: "Contact nearest bank branch",
    isBookmarked: false,
    applicants: 234000,
    successRate: 78,
    avgProcessingTime: "7 days",
    lastUpdated: "2025-01-08",
    officialUrl: "https://www.myscheme.gov.in/schemes/kcc",
  },
  {
    id: 5,
    title: "National Mission for Sustainable Agriculture",
    description: "Promoting sustainable agriculture practices and climate resilience",
    fullDescription:
      "NMSA aims to make agriculture more productive, sustainable, profitable and climate resilient by promoting location specific integrated/composite farming systems.",
    t: {
      hi: {
        title: "सतत कृषि के लिए राष्ट्रीय मिशन",
        description: "सतत कृषि पद्धतियों और जलवायु सहनशीलता को बढ़ावा",
        fullDescription: "एनएमएसए का उद्देश्य स्थान-विशिष्ट समेकित/संयोजित खेती प्रणालियों को बढ़ावा देकर कृषि को अधिक उत्पादक, टिकाऊ, लाभकारी एवं जलवायु-सहनशील बनाना है।",
      },
      ml: {
        title: "സുസ്ഥിര കൃഷിക്കായുള്ള ദേശീയ മിഷൻ",
        description: "സുസ്ഥിര കൃഷിരീതികളും കാലാവസ്ഥാ പ്രതിരോധ ശേഷിയും പ്രോത്സാഹിപ്പിക്കല്‍",
        fullDescription: "സ്ഥലവിശേഷമായ ഇന്റഗ്രേറ്റഡ്/കമ്പോസിറ്റ് കർഷക സംവിധാനങ്ങൾ പ്രോത്സാഹിപ്പിച്ച് കൃഷിയെ കൂടുതൽ ഉൽപാദനക്ഷമവും ലാഭകരവും കാലാവസ്ഥാ പ്രതിരോധ ശേഷിയുള്ളതുമാക്കുക എന്നതാണ് NMSA യുടെ ലക്ഷ്യം.",
      },
    },
    category: "Sustainability",
    amount: "Varies by component",
    eligibility: ["Progressive farmers", "FPOs", "Self Help Groups"],
    benefits: [
      "Training on sustainable practices",
      "Financial assistance for equipment",
      "Soil health improvement",
      "Water conservation support",
    ],
    applicationDeadline: "May 31, 2025",
    startDate: "April 2014",
    status: "active",
    region: "All India",
    department: "Ministry of Agriculture & Farmers Welfare",
    applicableStates: ["All States"],
    cropsApplicable: ["All Crops"],
    documentsRequired: ["Project Proposal", "Land Records", "Group Formation Certificate"],
    applicationProcess: "Through State Agriculture Department",
    contactInfo: "State NMSA Coordinator",
    isBookmarked: false,
    applicants: 67000,
    successRate: 91,
    avgProcessingTime: "45 days",
    lastUpdated: "2025-01-05",
    officialUrl: "https://nmsa.dac.gov.in/",
  },
  {
    id: 6,
    title: "Sub-Mission on Agricultural Mechanization",
    description: "Financial assistance for purchasing agricultural machinery and equipment",
    fullDescription:
      "SMAM aims to increase the reach of farm mechanization to small and marginal farmers and to the regions where availability of farm power is low.",
    t: {
      hi: {
        title: "कृषि मशीनीकरण पर उप-मिशन",
        description: "कृषि मशीनरी/उपकरण खरीद हेतु वित्तीय सहायता",
        fullDescription: "एसएमएएम का उद्देश्य लघु/सीमांत किसानों तथा कम फार्म पावर वाले क्षेत्रों तक कृषि मशीनीकरण पहुंचाना है।",
      },
      ml: {
        title: "കാർഷിക യന്ത്രവല്‍ക്കരണ ഉപമിഷൻ",
        description: "കാർഷിക യന്ത്രങ്ങൾ/ഉപകരണങ്ങൾ വാങ്ങാൻ സാമ്പത്തിക സഹായം",
        fullDescription: "SMAM ന്റെ ലക്ഷ്യം ചെറുകിട കർഷകരിലേക്കും കൃഷിയന്ത്ര ശക്തി കുറവുള്ള മേഖലകളിലേക്കും യന്ത്രവല്‍ക്കരണം വ്യാപിപ്പിക്കുന്നതാണ്.",
      },
    },
    category: "Mechanization",
    amount: "40-50% subsidy",
    eligibility: ["Small and marginal farmers", "Custom Hiring Centers", "FPOs"],
    benefits: [
      "Subsidized farm equipment",
      "Custom hiring services",
      "Training programs",
      "Demonstration of new technology",
    ],
    applicationDeadline: "December 31, 2025",
    startDate: "April 2014",
    status: "active",
    region: "All India",
    department: "Ministry of Agriculture & Farmers Welfare",
    applicableStates: ["All States"],
    cropsApplicable: ["All Crops"],
    documentsRequired: ["Aadhaar Card", "Land Records", "Bank Account", "Quotation"],
    applicationProcess: "Through State Agriculture Department or online portal",
    contactInfo: "State Mechanization Officer",
    isBookmarked: true,
    applicants: 98000,
    successRate: 82,
    avgProcessingTime: "60 days",
    lastUpdated: "2025-01-03",
    officialUrl: "https://agrimachinery.nic.in/",
  },
]

const notifications = [
  {
    id: 1,
    title: "PM-KISAN 16th Installment Released",
    message: "The 16th installment of PM-KISAN has been released. Check your bank account.",
    type: "success",
    date: "2025-01-15",
    schemeId: 1,
    t: {
      hi: {
        title: "पीएम-किसान की 16वीं किस्त जारी",
        message: "पीएम-किसान की 16वीं किस्त जारी हो गई है। अपना बैंक खाता जांचें।",
      },
      ml: {
        title: "പി.എം.-കിസാന്‍ 16-ാം ഗഡു പുറത്തിറക്കി",
        message: "പി.എം.-കിസാന്‍റെ 16-ാം ഗഡു പുറത്തിറക്കിയിരിക്കുന്നു. നിങ്ങളുടെ ബാങ്ക് അക്കൗണ്ട് പരിശോധിക്കുക.",
      },
    },
  },
  {
    id: 2,
    title: "Soil Health Card Application Deadline Extended",
    message: "Application deadline for Soil Health Card scheme extended to April 15, 2025.",
    type: "info",
    date: "2025-01-12",
    schemeId: 2,
    t: {
      hi: {
        title: "मृदा स्वास्थ्य कार्ड आवेदन की अंतिम तिथि बढ़ी",
        message: "मृदा स्वास्थ्य कार्ड योजना के लिए आवेदन की अंतिम तिथि 15 अप्रैल, 2025 तक बढ़ाई गई।",
      },
      ml: {
        title: "മണ്ണിന്റെ ആരോഗ്യ കാർഡ് അപേക്ഷാ അവസാന തീയതി നീട്ടി",
        message: "മണ്ണിന്റെ ആരോഗ്യ കാർഡ് പദ്ധതിക്കുള്ള അപേക്ഷ അവസാന തീയതി 2025 ഏപ്രിൽ 15 വരെ നീട്ടി.",
      },
    },
  },
  {
    id: 3,
    title: "New Crop Insurance Guidelines",
    message: "Updated guidelines for PMFBY released. Review new coverage details.",
    type: "warning",
    date: "2025-01-10",
    schemeId: 3,
    t: {
      hi: {
        title: "नई फसल बीमा दिशानिर्देश",
        message: "पीएमएफबीवाई के अद्यतन दिशानिर्देश जारी। नए कवरेज विवरण देखें।",
      },
      ml: {
        title: "പുതിയ വിള ഇൻഷുറൻസ് മാർഗ്ഗനിർദ്ദേശങ്ങൾ",
        message: "PMFBY യുടെ പുതുക്കിയ മാർഗ്ഗനിർദ്ദേശങ്ങൾ പുറത്തിറക്കി. പുതിയ കവറേജ് വിശദാംശങ്ങൾ പരിശോധിക്കുക.",
      },
    },
  },
]

export default function SchemesPage() {
  const { lang } = useLanguage()
  const tr = {
    en: {
      title: "Government Schemes",
      subtitle: "Discover and apply for agricultural schemes and subsidies",
      availableSchemes: "Available Schemes",
      bookmarked: "Bookmarked",
      totalBenefits: "Total Benefits",
      avgSuccess: "Avg Success Rate",
      recentUpdates: "Recent Updates",
      newUpdates: "New Updates",
      searchPlaceholder: "Search schemes by name or description...",
      category: "Category",
      region: "Region",
      all: "All",
      allIndia: "All India",
      allSchemesTab: "All Schemes",
      bookmarkedTab: "Bookmarked",
      eligibleTab: "Eligible for You",
      daysLeft: "days left",
      applied: "applied",
      eligible: "Eligible",
      new: "New",
      applyNow: "Apply Now",
      viewDetails: "View Details",
      schemeDetails: "Scheme Details",
      eligibility: "Eligibility Criteria",
      benefits: "Benefits",
      requiredDocs: "Required Documents",
      applicationProcess: "Application Process",
      contact: "Contact",
      close: "Close",
      statusActive: "Active",
      statusUpcoming: "Upcoming",
      statusExpired: "Expired",
    },
    hi: {
      title: "सरकारी योजनाएँ",
      subtitle: "कृषि योजनाओं और सब्सिडी के लिए खोजें और आवेदन करें",
      availableSchemes: "उपलब्ध योजनाएँ",
      bookmarked: "बुकमार्क्ड",
      totalBenefits: "कुल लाभ",
      avgSuccess: "औसत सफलता दर",
      recentUpdates: "नवीनतम अपडेट",
      newUpdates: "नए अपडेट",
      searchPlaceholder: "नाम या विवरण से योजनाएँ खोजें...",
      category: "श्रेणी",
      region: "क्षेत्र",
      all: "सभी",
      allIndia: "समूचा भारत",
      allSchemesTab: "सभी योजनाएँ",
      bookmarkedTab: "बुकमार्क्ड",
      eligibleTab: "आपके लिए योग्य",
      daysLeft: "दिन शेष",
      applied: "लोगों ने आवेदन किया",
      eligible: "पात्र",
      new: "नया",
      applyNow: "अभी आवेदन करें",
      viewDetails: "विवरण देखें",
      schemeDetails: "योजना विवरण",
      eligibility: "पात्रता मानदंड",
      benefits: "लाभ",
      requiredDocs: "आवश्यक दस्तावेज",
      applicationProcess: "आवेदन प्रक्रिया",
      contact: "संपर्क",
      close: "बंद करें",
      statusActive: "सक्रिय",
      statusUpcoming: "आगामी",
      statusExpired: "समाप्त",
    },
    ml: {
      title: "സർക്കാർ പദ്ധതികൾ",
      subtitle: "കാർഷിക പദ്ധതികളും സബ്സിഡികളും കണ്ടെത്തുക, അപേക്ഷിക്കുക",
      availableSchemes: "ലഭ്യമായ പദ്ധതികൾ",
      bookmarked: "ബുക്ക് മാർക്ക് ചെയ്തത്",
      totalBenefits: "ആകെ ആനുകൂല്യങ്ങൾ",
      avgSuccess: "ശരാശരി വിജയനിരക്ക്",
      recentUpdates: "അടുത്തിടെ വന്ന അപ്ഡേറ്റുകൾ",
      newUpdates: "പുതിയ അപ്ഡേറ്റുകൾ",
      searchPlaceholder: "പേരിലോ വിവരണത്തിലോ നിന്ന് പദ്ധതികൾ തിരയുക...",
      category: "വർഗം",
      region: "പ്രദേശം",
      all: "എല്ലാം",
      allIndia: "ഇന്ത്യ മുഴുവൻ",
      allSchemesTab: "എല്ലാ പദ്ധതികളും",
      bookmarkedTab: "ബുക്ക് മാർക്ക് ചെയ്തത്",
      eligibleTab: "നിങ്ങൾക്ക് യോഗ്യം",
      daysLeft: "ദിവസങ്ങൾ ബാക്കി",
      applied: "അപേക്ഷിച്ചു",
      eligible: "യോഗ്യം",
      new: "പുതിയത്",
      applyNow: "ഇപ്പോള്‍ അപേക്ഷിക്കുക",
      viewDetails: "വിശദാംശങ്ങൾ",
      schemeDetails: "പദ്ധതിയുടെ വിശദാംശങ്ങൾ",
      eligibility: "യോഗ്യത മാനദണ്ഡങ്ങൾ",
      benefits: "ആനുകൂല്യങ്ങൾ",
      requiredDocs: "ആവശ്യമായ രേഖകൾ",
      applicationProcess: "അപേക്ഷാ പ്രക്രിയ",
      contact: "ബന്ധപ്പെടുക",
      close: "അടയ്ക്കുക",
      statusActive: "സജീവം",
      statusUpcoming: "വരും ദിവസങ്ങളിൽ",
      statusExpired: "കാലഹരണപ്പെട്ടു",
    },
  } as const
  const tt = (k: keyof typeof tr.en) => tr[(['en','hi','ml'] as const).includes(lang as any) ? (lang as 'en'|'hi'|'ml') : 'en'][k]
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedScheme, setSelectedScheme] = useState<number | null>(null)
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<number[]>([1, 3, 6])

  const categories = [
    "All",
    "Income Support",
    "Insurance",
    "Credit",
    "Soil Management",
    "Sustainability",
    "Mechanization",
  ]
  const regions = [tt('allIndia'), "North India", "South India", "East India", "West India", "Central India"]

  const filteredSchemes = governmentSchemes.filter((scheme) => {
    const matchesSearch =
      scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory
    const matchesRegion = selectedRegion === "all" || scheme.region === selectedRegion

    return matchesSearch && matchesCategory && matchesRegion
  })

  const toggleBookmark = (schemeId: number) => {
    setBookmarkedSchemes((prev) =>
      prev.includes(schemeId) ? prev.filter((id) => id !== schemeId) : [...prev, schemeId],
    )
  }

  const getNotificationTitle = (n: any) => n?.t?.[lang]?.title ?? n.title
  const getNotificationMessage = (n: any) => n?.t?.[lang]?.message ?? n.message

  const getStatusLabel = (status: string) => {
    const s = (status || '').toLowerCase()
    if (s === 'active') return tt('statusActive')
    if (s === 'upcoming') return tt('statusUpcoming')
    return tt('statusExpired')
  }

  // Language-aware accessors for per-scheme fields
  const getSchemeTitle = (s: any): string => (s?.t?.[lang]?.title ?? s?.title ?? '') as string
  const getSchemeDescription = (s: any): string => (s?.t?.[lang]?.description ?? s?.description ?? '') as string

  // Localize common dynamic fields
  const getCategoryLabel = (cat: string) => {
    const c = (cat || '').toLowerCase()
    if (lang === 'hi') {
      if (c === 'income support') return 'आय सहायता'
      if (c === 'soil management') return 'मृदा प्रबंधन'
      if (c === 'insurance') return 'बीमा'
      if (c === 'credit') return 'ऋण'
      if (c === 'sustainability') return 'सततता'
      if (c === 'mechanization') return 'मशीनीकरण'
    }
    if (lang === 'ml') {
      if (c === 'income support') return 'വരുമാന സഹായം'
      if (c === 'soil management') return 'മണ്ണ് മാനേജ്മെന്റ്'
      if (c === 'insurance') return 'ബീമ'
      if (c === 'credit') return 'ക്രെഡിറ്റ്'
      if (c === 'sustainability') return 'സുസ്ഥിരത'
      if (c === 'mechanization') return 'യന്ത്രവൽക്കരണം'
    }
    return cat
  }

  const getRegionLabel = (r: string) => {
    if ((r || '').toLowerCase() === 'all india') return tt('allIndia')
    return r
  }

  const formatApplied = (n: number) => `${n.toLocaleString()} ${tt('applied')}`

  const formatOngoing = (s: string) => {
    const v = (s || '').toLowerCase()
    if (v === 'ongoing') return lang === 'hi' ? 'चल रहा है' : lang === 'ml' ? 'നടന്നുകൊണ്ടിരിക്കുന്നു' : 'Ongoing'
    return s
  }

  const formatDays = (s: string) => {
    // Expect formats like "15 days"
    const m = /^(\d+)\s+days$/i.exec(s || '')
    if (!m) return s
    const num = Number(m[1])
    if (lang === 'hi') return `${num} दिन`
    if (lang === 'ml') return `${num} ദിവസം`
    return s
  }

  // Locale-aware date formatting
  const fmtLocale = lang === 'hi' ? 'hi-IN' : lang === 'ml' ? 'ml-IN' : 'en-US'
  const formatDate = (value: string) => {
    // Accept ISO like 2025-01-15 or human readable; try Date parsing
    const d = new Date(value)
    if (isNaN(d.getTime())) return value
    try {
      return new Intl.DateTimeFormat(fmtLocale, { year: 'numeric', month: 'long', day: 'numeric' }).format(d)
    } catch {
      return value
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "info":
        return <Bell className="w-5 h-5 text-blue-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tt('title')}</h1>
            <p className="text-gray-600 mt-1">{tt('subtitle')}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="text-xs bg-red-600 text-white">
              {notifications.length} {tt('newUpdates')}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{governmentSchemes.length}</div>
              <div className="text-sm text-gray-600">{tt('availableSchemes')}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BookmarkCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{bookmarkedSchemes.length}</div>
              <div className="text-sm text-gray-600">{tt('bookmarked')}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Banknote className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">₹12L+</div>
              <div className="text-sm text-gray-600">{tt('totalBenefits')}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">87%</div>
              <div className="text-sm text-gray-600">{tt('avgSuccess')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card className="border-0 shadow-md border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-500" />
              <span>{tt('recentUpdates')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {notification.date}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={tt('searchPlaceholder')}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={tt('category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category === "All" ? "all" : category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={tt('region')} />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region === "All India" ? "all" : region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">{tt('allSchemesTab')} ({filteredSchemes.length})</TabsTrigger>
            <TabsTrigger value="bookmarked">{tt('bookmarkedTab')} ({bookmarkedSchemes.length})</TabsTrigger>
            <TabsTrigger value="eligible">{tt('eligibleTab')} (4)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredSchemes.map((scheme) => (
                <Card key={scheme.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getStatusColor(scheme.status)}>
                            {getStatusLabel(scheme.status)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {scheme.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{getSchemeTitle(scheme)}</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(scheme.id)}
                        className="text-gray-400 hover:text-orange-500"
                      >
                        {bookmarkedSchemes.includes(scheme.id) ? (
                          <BookmarkCheck className="w-5 h-5 text-orange-500" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{getSchemeDescription(scheme)}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">{scheme.amount}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-600">{scheme.applicationDeadline}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-600">{scheme.region}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-600">{scheme.applicants.toLocaleString()} applied</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{scheme.successRate}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{scheme.avgProcessingTime}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => setSelectedScheme(scheme.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookmarked" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredSchemes
                .filter((scheme) => bookmarkedSchemes.includes(scheme.id))
                .map((scheme) => (
                  <Card key={scheme.id} className="border-0 shadow-md border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{getSchemeTitle(scheme)}</h3>
                        <BookmarkCheck className="w-5 h-5 text-orange-500" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{getSchemeDescription(scheme)}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-green-600">{scheme.amount}</span>
                        <Button size="sm" variant="outline" asChild>
                          <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer">
                            {tt('applyNow')}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="eligible" className="space-y-4">
            <div className="text-center py-8">
              <Award className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Recommendations</h3>
              <p className="text-gray-600 mb-4">Based on your farm profile, you're eligible for these schemes</p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Complete Profile for Recommendations
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Scheme Detail Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{tt('schemeDetails')}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedScheme(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const scheme = governmentSchemes.find((s) => s.id === selectedScheme)
                  if (!scheme) return null

                  return (
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">{getSchemeTitle(scheme)}</h2>
                          <p className="text-sm text-gray-600">{getSchemeDescription(scheme)}</p>
                          <div className="flex items-center space-x-4">
                            <Badge className={getStatusColor(scheme.status)}>
                              {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                            </Badge>
                            <Badge variant="outline">{scheme.category}</Badge>
                            <div className="flex items-center space-x-1 text-green-600 font-semibold">
                              <IndianRupee className="w-4 h-4" />
                              <span>{scheme.amount}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(scheme.id)}
                          className="text-gray-400 hover:text-orange-500"
                        >
                          {bookmarkedSchemes.includes(scheme.id) ? (
                            <BookmarkCheck className="w-6 h-6 text-orange-500" />
                          ) : (
                            <Bookmark className="w-6 h-6" />
                          )}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">{tt('eligibility')}</h3>
                          <ul className="space-y-2">
                            {scheme.eligibility.map((criteria, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>{criteria}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">{tt('benefits')}</h3>
                          <ul className="space-y-2">
                            {scheme.benefits.map((benefit, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                                <Award className="w-4 h-4 text-orange-500" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">{tt('requiredDocs')}</h3>
                          <ul className="space-y-1">
                            {scheme.documentsRequired.map((doc, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">{tt('applicationProcess')}</h3>
                          <p className="text-sm text-gray-600 mb-2">{scheme.applicationProcess}</p>
                          <div className="text-sm text-gray-600">
                            <strong>{tt('contact')}:</strong> {scheme.contactInfo}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-gray-900">{scheme.applicants.toLocaleString()}</div>
                            <div className="text-xs text-gray-600">Total Applicants</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">{scheme.successRate}%</div>
                            <div className="text-xs text-gray-600">Success Rate</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">{scheme.avgProcessingTime}</div>
                            <div className="text-xs text-gray-600">Processing Time</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-purple-600">{scheme.lastUpdated}</div>
                            <div className="text-xs text-gray-600">Last Updated</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" asChild>
                          <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {tt('applyNow')}
                          </a>
                        </Button>
                        <Button variant="outline" onClick={() => toggleBookmark(scheme.id)}>
                          {bookmarkedSchemes.includes(scheme.id) ? tt('bookmarkedTab') : 'Bookmark'}
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedScheme(null)}>
                          {tt('close')}
                        </Button>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
