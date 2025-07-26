"use client"

import { useState, useRef } from "react"
import { Store, Building2, DollarSign, Calendar, UserCircle, Image as ImageIcon, MapPin, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import PropertyName from "../PropertyName"
import RetailStoreType from "../CommercialComponents/RetailStoreType"
import CommercialPropertyAddress from "../CommercialComponents/CommercialPropertyAddress"
import Landmark from "../CommercialComponents/Landmark"
import MapCoordinates from "../MapCoordinates"
import CornerProperty from "../CommercialComponents/CornerProperty"
import RetailStoreDetails from "../CommercialComponents/RetailStoreDetails"
import CommercialPropertyDetails from "../CommercialComponents/CommercialPropertyDetails"
import LeaseAmount from "../lease/LeaseAmount"
import LeaseTenure from "../lease/LeaseTenure"
import MaintenanceAmount from "../residentialrent/MaintenanceAmount"
import OtherCharges from "../residentialrent/OtherCharges"
import Brokerage from "../residentialrent/Brokerage"
import CommercialAvailability from "../CommercialComponents/CommercialAvailability"
import CommercialContactDetails from "../CommercialComponents/CommercialContactDetails"
import CommercialMediaUpload from "../CommercialComponents/CommercialMediaUpload"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import MapLocation from "../CommercialComponents/MapLocation"

interface FormData {
  basicInformation: {
    title: string;
   Type: string[];
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    landmark: string;
    location: {
      latitude: string;
      longitude: string;
    };
    isCornerProperty: boolean;
  };
  propertyDetails: {
    retailStoreDetails: {
    location: string;
    anchorStores: boolean;
    footfallData: string;
    signageAllowed: boolean;
    sharedWashrooms: boolean;
    fireExit: boolean;
  };
    area: {
      totalArea: number;
      carpetArea: number;
      builtUpArea: number;
    };
    floor: {
      floorNumber: number;
      totalFloors: number;
    };
    facingDirection: string;
    furnishingStatus: string;
    propertyAmenities: string[];
    wholeSpaceAmenities: string[];
    electricitySupply: {
      powerLoad: number;
      backup: boolean;
    };
    waterAvailability: string;
    propertyAge: string;
    propertyCondition: string;
  };
  leaseTerms: {
      leaseAmount: {
        amount: number;
        type: string;
        duration: number;
        durationUnit: string;
      };
    leaseTenure: {
      minimumTenure: number;
      minimumUnit: string;
      maximumTenure: number;
      maximumUnit: string;
      lockInPeriod: number;
      lockInUnit: string;
      noticePeriod: number;
      noticePeriodUnit: string;
    };
    maintenanceAmount: {
      amount: number;
      frequency: string;
    };
    otherCharges: {
      water: {
        amount: number;
        type: string;
      };
      electricity: {
        amount: number;
        type: string;
      };
      gas: {
        amount: number;
        type: string;
      };
      others: {
        amount: number;
        type: string;
      };
    };
    brokerage: {
      required: string;
      amount?: number;
    };
    availability: {
      date: Date;
      availableImmediately: boolean;
      preferredSaleDuration: string;
      noticePeriod: string;
      isPetsAllowed: boolean;
      operatingHours: boolean;
    };
  },
  
  contactInformation: {
    name: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    bestTimeToContact?: string;
    },
  media: {
    photos: {
      exterior: File[];
      interior: File[];
      floorPlan: File[];
      washrooms: File[];
      lifts: File[];
      emergencyExits: File[];
    };
    videoTour: File | null;
    documents: File[];
  };
  metadata?: {
    createdBy: string;
    createdAt: Date;
    userId: string;
    propertyType: string;
    propertyName: string;
    intent: string;
    status: string;
  };
}

const LeaseRetailStoreMain = () => {
  const [formData, setFormData] = useState<FormData>({
    basicInformation: {
      title: '',
      Type: [],
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      landmark: '',
      location: {
        latitude: '',
        longitude: ''
      },
      isCornerProperty: false
    },
    propertyDetails: {
      retailStoreDetails: {
      location: '',
      anchorStores: false,
      footfallData: '',
      signageAllowed: false,
      sharedWashrooms: false,
      fireExit: false
    },
      area: {
        totalArea: 0,
        carpetArea: 0,
        builtUpArea: 0
      },
      floor: {
        floorNumber: 0,
        totalFloors: 0
      },
      facingDirection: '',
      furnishingStatus: '',
      propertyAmenities: [],
      wholeSpaceAmenities: [],
      electricitySupply: {
        powerLoad: 0,
        backup: false
      },
      waterAvailability: '',
      propertyAge: '',
      propertyCondition: ''
    },
    leaseTerms: {
        leaseAmount: {
          amount: 0,
          type: 'fixed',
          duration: 0,
          durationUnit: 'years'
        },
        leaseTenure: {
          minimumTenure: 0,
          minimumUnit: 'years',
          maximumTenure: 0,
          maximumUnit: 'years',
          lockInPeriod: 0,
          lockInUnit: 'years',
          noticePeriod: 0,
          noticePeriodUnit: 'months'
      },
      maintenanceAmount: {
        amount: 0,
        frequency: 'monthly'
      },
      otherCharges: {
        water: {
          amount: 0,
          type: 'inclusive',
        },
        electricity: {
          amount: 0,
          type: 'inclusive',
        },
        gas: {
          amount: 0,
          type: 'inclusive',
        },
        others: {
          amount: 0,
          type: 'inclusive',
        },
      },
      brokerage: {
        required: 'no',
        amount: 0
      },
      availability: {
        date: new Date(),
        availableImmediately: false,
        preferredSaleDuration: '',
        noticePeriod: '',
        isPetsAllowed: false,
        operatingHours: false,
      },
    },
    contactInformation: {
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      bestTimeToContact: ''
    },
    media: {
      photos: {
        exterior: [],
        interior: [],
        floorPlan: [],
        washrooms: [],
        lifts: [],
        emergencyExits: []
      },

      videoTour: null,
      documents: []
    }
  });

  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  const formRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      title: "Basic Information",
      icon: <Store className="w-5 h-5" />,
      component: (
        <div className="space-y-8">
          <div className="space-y-6">
            <PropertyName
              propertyName={formData.basicInformation.title}
              onPropertyNameChange={(name) => setFormData(prev => ({
                ...prev,
                basicInformation: { ...prev.basicInformation, title: name }
              }))}
            />
            <RetailStoreType
              onRetailTypeChange={(types) => setFormData(prev => ({
                ...prev,
                basicInformation: { ...prev.basicInformation, Type: types }
              }))}
            />
          </div>

          <div className="space-y-6">
          <CommercialPropertyAddress address={formData.basicInformation.address} onAddressChange={(address) => setFormData(prev => ({ ...prev, basicInformation: { ...prev.basicInformation, address } }))} />
            <MapLocation
              latitude={formData.basicInformation.location.latitude}
              longitude={formData.basicInformation.location.longitude}
              landmark={formData.basicInformation.landmark}
              onLocationChange={(location) => setFormData(prev => ({ ...prev, basicInformation: { ...prev.basicInformation, location } }))}
              onAddressChange={(address) => setFormData(prev => ({ ...prev, basicInformation: { ...prev.basicInformation, address } }))}
              onLandmarkChange={(landmark) => setFormData(prev => ({ ...prev, basicInformation: { ...prev.basicInformation, landmark } }))}
            />
            <CornerProperty
              isCornerProperty={formData.basicInformation.isCornerProperty}
              onCornerPropertyChange={(isCorner) => setFormData(prev => ({
                ...prev,
                basicInformation: { ...prev.basicInformation, isCornerProperty: isCorner }
              }))}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Property Details",
      icon: <Building2 className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          <RetailStoreDetails
            onDetailsChange={(details) => setFormData(prev => ({
              ...prev,
              propertyDetails: { ...prev.propertyDetails, retailStoreDetails: { ...prev.propertyDetails.retailStoreDetails, ...details } }
            }))}
          />
          <CommercialPropertyDetails
            onDetailsChange={(details) => setFormData(prev => ({
              ...prev,
              propertyDetails: {
                ...prev.propertyDetails,
                ...details,
                propertyAge: details.propertyAge ?? '',
                electricitySupply: {
                  ...prev.propertyDetails.electricitySupply,
                  ...details.electricitySupply,
                  powerLoad: details.electricitySupply?.powerLoad ?? 0
                },
                waterAvailability: details.waterAvailability
              }
            }))}
          />
        </div>
      ),
    },
    {
      title: "Lease Terms",
      icon: <DollarSign className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          <div className="space-y-4">
            <LeaseAmount
              onLeaseAmountChange={(amount) => setFormData(prev => ({
                ...prev,
                leaseTerms: {
                  ...prev.leaseTerms,
                    leaseAmount: {
                      amount: amount.amount || 0,
                      type: amount.type || 'fixed',
                      duration: amount.duration || 0,
                      durationUnit: amount.durationUnit || 'years'
                    }
                  
                }
              }))}
            />
            <LeaseTenure
              onLeaseTenureChange={(tenure) => setFormData(prev => ({
                ...prev,
                leaseTerms: {
                  ...prev.leaseTerms,
                  leaseTenure: {
                    minimumTenure: Number(tenure.minimumTenure) || 0,
                    minimumUnit: tenure.minimumUnit || 'years',
                    maximumTenure: Number(tenure.maximumTenure) || 0,
                    maximumUnit: tenure.maximumUnit || 'years',
                    lockInPeriod: Number(tenure.lockInPeriod) || 0,
                    lockInUnit: tenure.lockInUnit || 'years',
                    noticePeriod: Number(tenure.noticePeriod) || 0,
                    noticePeriodUnit: tenure.noticePeriodUnit || 'months'
                  }
                }
              }))}
            />
            <MaintenanceAmount
              maintenanceAmount={formData.leaseTerms.maintenanceAmount}
              onMaintenanceAmountChange={(maintenance) => setFormData(prev => ({
                ...prev,
                leaseTerms: {
                  ...prev.leaseTerms,
                  maintenanceAmount: {
                    amount: Number(maintenance.amount) || 0,
                    frequency: maintenance.frequency || 'monthly'
                  }
                }
              }))}
            />
            <div className="space-y-4">
              <div className="border-t border-gray-200 my-4"></div>
              <OtherCharges
                otherCharges={formData.leaseTerms.otherCharges}
                onOtherChargesChange={(charges) => setFormData(prev => ({
                  ...prev,
                  leaseTerms: {
                    ...prev.leaseTerms,
                    otherCharges: { ...prev.leaseTerms.otherCharges, ...charges }
                  }
                }))}
              />
              <Brokerage
                bro={formData.leaseTerms.brokerage}
                onBrokerageChange={(brokerage) => setFormData(prev => ({
                  ...prev,
                  leaseTerms: {
                    ...prev.leaseTerms,
                    brokerage: {
                      required: brokerage.required || 'no',
                      amount: brokerage.amount || 0
                    }
                  }
                }))}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Availability",
      icon: <Calendar className="w-5 h-5" />,
      component: (
        <CommercialAvailability
          onAvailabilityChange={(availability) => setFormData(prev => ({
            ...prev,
            leaseTerms: {
              ...prev.leaseTerms,
              availability: {
                date: availability.availableImmediately ? new Date() : availability.date,
                availableImmediately: availability.availableImmediately,
                preferredSaleDuration: availability.preferredSaleDuration,
                noticePeriod: availability.noticePeriod,
                isPetsAllowed: availability.isPetsAllowed,
                operatingHours: availability.operatingHours
              }
            }
          }))}
        />
      ),
    },
    {
      title: "Contact Information",
      icon: <UserCircle className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          <CommercialContactDetails
            contactInformation={formData.contactInformation}
            onContactChange={(contact) => setFormData(prev => ({
              ...prev,
              contactInformation: { ...prev.contactInformation, ...contact }
            }))}
          />
        </div>
      ),
    },
    {
      title: "Property Media",
      icon: <ImageIcon className="w-5 h-5" />,
      component: (
        <div className="space-y-6">
          <CommercialMediaUpload
            Media={{
              photos: Object.entries(formData.media.photos).map(([category, files]) => ({
                category,
                files: files.map(file => ({ url: URL.createObjectURL(file), file }))
              })),
              videoTour: formData.media.videoTour || null,
              documents: formData.media.documents
            }}
              onMediaChange={(media) => {
                const photosByCategory: Record<string, File[]> = {
                  exterior: [],
                  interior: [],
                  floorPlan: [],
                  washrooms: [],
                  lifts: [],
                  emergencyExits: []
                };

                media.photos.forEach(({ category, files }) => {
                  if (category in photosByCategory) {
                    photosByCategory[category] = files.map(f => f.file);
                  }
                });

                setFormData(prev => ({
                  ...prev,
                  media: {
                    photos: {
                      exterior: photosByCategory.exterior,
                      interior: photosByCategory.interior,
                      floorPlan: photosByCategory.floorPlan,
                      washrooms: photosByCategory.washrooms,
                      lifts: photosByCategory.lifts,
                      emergencyExits: photosByCategory.emergencyExits
                    },
                    videoTour: media.videoTour || null,
                    documents: media.documents
                  }
                }));
              }}
            />
        </div>
      ),
    },
  ];

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = sessionStorage.getItem('user');
      if (user) {
        const author = JSON.parse(user).id;

        const convertedMedia = {
          photos: {
            exterior: await Promise.all((formData.media?.photos?.exterior ?? []).map(convertFileToBase64)),
            interior: await Promise.all((formData.media?.photos?.interior ?? []).map(convertFileToBase64)),
            floorPlan: await Promise.all((formData.media?.photos?.floorPlan ?? []).map(convertFileToBase64)),
            washrooms: await Promise.all((formData.media?.photos?.washrooms ?? []).map(convertFileToBase64)),
            lifts: await Promise.all((formData.media?.photos?.lifts ?? []).map(convertFileToBase64)),
            emergencyExits: await Promise.all((formData.media?.photos?.emergencyExits ?? []).map(convertFileToBase64))
          },
          videoTour: formData.media?.videoTour ? await convertFileToBase64(formData.media.videoTour) : null,
          documents: await Promise.all((formData.media?.documents ?? []).map(convertFileToBase64))
        };

        const transformedData = {
          basicInformation: {
            title: formData.basicInformation.title || '',
            type: Array.isArray(formData.basicInformation.type) ? formData.basicInformation.type : [],
            address: {
              street: formData.basicInformation.address.street || '',
              city: formData.basicInformation.address.city || '',
              state: formData.basicInformation.address.state || '',
              zipCode: formData.basicInformation.address.zipCode || ''
            },
            landmark: formData.basicInformation.landmark || '',
            location: {
              latitude: formData.basicInformation.location.latitude || '',
              longitude: formData.basicInformation.location.longitude || ''
            },
            isCornerProperty: formData.basicInformation.isCornerProperty || false
          },
          propertyDetails: formData.propertyDetails,
          leaseTerms: {
            ...formData.leaseTerms,
            availability: formData.leaseTerms.availability,
            brokerage: {
              required: formData.leaseTerms.brokerage.required || 'no',
              amount: formData.leaseTerms.brokerage.amount || 0
            }
          },
          contactInformation: formData.contactInformation,
          media: convertedMedia,
          metadata: {
            createdBy: author,
            createdAt: new Date(),
            userId: author,
            propertyType: 'Commercial',
            propertyName: 'Retail Store',
            intent: 'Lease',
            status: 'Available',
          }
        };

        console.log('Sending data:', JSON.stringify(transformedData, null, 2));

        const response = await axios.post('/api/commercial/lease/retail-store', transformedData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          toast.success('Retail store lease listing created successfully!');
        }
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to create retail store lease listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => {
        if (formRef.current) {
          window.scrollTo({
            top: formRef.current.offsetTop - 100,
            behavior: 'smooth'
          });
        } else {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        if (formRef.current) {
          window.scrollTo({
            top: formRef.current.offsetTop - 100,
            behavior: 'smooth'
          });
        } else {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  return (
    <div ref={formRef}  className="min-h-screen bg-white">
      {/* Progress indicator */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center cursor-pointer"
                  onClick={() => setCurrentStep(i)}
                >
                  <div className="flex flex-col items-center group">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${i <= currentStep ? "bg-black text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                    >
                      {s.icon}
                    </div>
                    <span
                      className={`text-xs mt-1 font-medium transition-colors duration-200 ${i <= currentStep ? "text-black" : "text-gray-500 group-hover:text-gray-700"
                        }`}
                    >
                      {s.title}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex items-center mx-1">
                      <div
                        className={`w-12 h-1 transition-colors duration-200 ${i < currentStep ? "bg-black" : "bg-gray-200"
                          }`}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Lease Commercial Retail Store</h1>
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">{steps[currentStep].title}</h2>
          <p className="text-gray-600">Please fill in the details for your property</p>
        </div>

        {steps[currentStep].component}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-2 rounded-lg border border-black/20 transition-all duration-200 ${currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>
          <button
            onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Submitting...
              </>
            ) : (
              <>
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaseRetailStoreMain;
