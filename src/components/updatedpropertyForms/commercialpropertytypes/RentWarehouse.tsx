import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropertyName from '../PropertyName';
import WarehouseType from '../CommercialComponents/WarehouseType';
import CommercialPropertyAddress from '../CommercialComponents/CommercialPropertyAddress';
import Landmark from '../CommercialComponents/Landmark';
import MapCoordinates from '../MapCoordinates';
import CornerProperty from '../CommercialComponents/CornerProperty';
import WarehouseDetails from '../CommercialComponents/WarehouseDetails';
import CommercialPropertyDetails from '../CommercialComponents/CommercialPropertyDetails';
import Rent from '../residentialrent/Rent';
import SecurityDeposit from '../residentialrent/SecurityDeposit';
import MaintenanceAmount from '../residentialrent/MaintenanceAmount';
import OtherCharges from '../residentialrent/OtherCharges';
import Brokerage from '../residentialrent/Brokerage';
import AvailabilityDate from '../AvailabilityDate';
import CommercialContactDetails from '../CommercialComponents/CommercialContactDetails';
import CommercialMediaUpload from '../CommercialComponents/CommercialMediaUpload';
import { MapPin, Building2, DollarSign, Calendar, User, Image, Warehouse, ImageIcon, UserCircle, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import MapLocation from '../CommercialComponents/MapLocation';

// Define the FormData interface to match the backend structure
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
  warehouseDetails: {
    access24x7: boolean;
    ceilingHeight: number;
    totalArea: number;
    docks: {
      height: number;
      count: number;
    };
    floorLoadCapacity: number;
    fireSafety: boolean;
    securityPersonnel: boolean;
    truckParking: boolean;
  };
  propertyDetails: {
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
  rentalTerms: {
    rentDetails: {
      expectedRent: number;
      isNegotiable: boolean;
      rentType: string;
    };
    securityDeposit: {
      amount: number;
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
  };
  brokerage: {
    required: string;
    amount?: number;
  };
  availability: {
    type: string;
    date?: string;
  };
  contactInformation: {
    name: string;
    email: string;
    phone: string;
    alternatePhone: string;
    bestTimeToContact: string;
  };
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
  metadata: {
    createdBy: string;
    createdAt: Date;
    propertyType: 'Commercial';
    propertyName: 'Warehouse';
    intent: 'Rent';
    status: 'Available' | 'Rented' | 'Under Maintenance';
  };
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const RentWarehouse = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    basicInformation: {
      title: '',
      Type: [],
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      landmark: '',
      location: {
        latitude: '',
        longitude: '',
      },
      isCornerProperty: false,
    },
    warehouseDetails: {
      access24x7: false,
      ceilingHeight: 0,
      totalArea: 0,
      docks: {
        height: 0,
        count: 0,
      },
      floorLoadCapacity: 0,
      fireSafety: false,
      securityPersonnel: false,
      truckParking: false,
    },
    propertyDetails: {
      area: {
        totalArea: 0,
        carpetArea: 0,
        builtUpArea: 0,
      },
      floor: {
        floorNumber: 0,
        totalFloors: 0,
      },
      facingDirection: '',
      furnishingStatus: '',
      propertyAmenities: [],
      wholeSpaceAmenities: [],
      electricitySupply: {
        powerLoad: 0,
        backup: false,
      },
      waterAvailability: '',
      propertyAge: '',
      propertyCondition: '',
    },
    rentalTerms: {
      rentDetails: {
        expectedRent: 0,
        isNegotiable: false,
        rentType: '',
      },
      securityDeposit: {
        amount: 0,
      },
      maintenanceAmount: {
        amount: 0,
        frequency: '',
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
    },
    
    brokerage: {
      required: 'no',
      amount: 0,
    },
    availability: {
      type: 'immediate',
      date: '',
    },
    contactInformation: {
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      bestTimeToContact: '',
    },
    media: {
      photos: {
        exterior: [],
        interior: [],
        floorPlan: [],
        washrooms: [],
        lifts: [],
        emergencyExits: [],
      },
      videoTour: null,
      documents: [],
    },
    metadata: {
      createdBy: '',
      createdAt: new Date(),
      propertyType: 'Commercial',
      propertyName: 'Warehouse',
      intent: 'Rent',
      status: 'Available',
    },
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePropertyNameChange = (name: string) => {
    setFormData({
      ...formData,
      basicInformation: {
        ...formData.basicInformation,
        title: name
      }
    });
  };

  const handleWarehouseTypeChange = (types: string[]) => {
    setFormData({
      ...formData,
      basicInformation: {
        ...formData.basicInformation,
        Type: types
      }
    });
  };

  const handleAddressChange = (address: { street: string; city: string; state: string; zipCode: string; }) => {
    setFormData({
      ...formData,
      basicInformation: {
        ...formData.basicInformation,
        address
      }
    });
  };

  const handleLandmarkChange = (landmark: string) => {
    setFormData({
      ...formData,
      basicInformation: {
        ...formData.basicInformation,
        landmark
      }
    });
  };

  // const handleLocationChange = (location: { latitude: string; longitude: string; }) => {
  //   setFormData({
  //     ...formData,
  //     basicInformation: {
  //       ...formData.basicInformation,
  //       location: {
  //         latitude: parseFloat(location.latitude),
  //         longitude: parseFloat(location.longitude)
  //       }
  //     }
  //   });
  // };

  const handleCornerPropertyChange = (isCorner: boolean) => {
    setFormData({
      ...formData,
      basicInformation: {
        ...formData.basicInformation,
        isCornerProperty: isCorner
      }
    });
  };

  const handleWarehouseDetailsChange = (details: Record<string, any>) => {
    setFormData({
      ...formData,
      warehouseDetails: {
        access24x7: details.access24x7 || false,
        ceilingHeight: details.ceilingHeight || 0,
        totalArea: details.totalArea || 0,
        docks: {
          height: details.docks?.height || 0,
          count: details.docks?.count || 0
        },
        floorLoadCapacity: details.floorLoadCapacity || 0,
        fireSafety: details.fireSafety || false,
        securityPersonnel: details.securityPersonnel || false,
        truckParking: details.truckParking || false
      }
    });
  };

  const handlePropertyDetailsChange = (details: Record<string, any>) => {
    setFormData({
      ...formData,
      propertyDetails: {
        area: {
          totalArea: details.area?.totalArea || 0,
          carpetArea: details.area?.carpetArea || 0,
          builtUpArea: details.area?.builtUpArea || 0
        },
        floor: {
          floorNumber: details.floor?.floorNumber || 0,
          totalFloors: details.floor?.totalFloors || 0
        },
        facingDirection: details.facingDirection || '',
        furnishingStatus: details.furnishingStatus || '',
        propertyAmenities: details.propertyAmenities || [],
        wholeSpaceAmenities: details.wholeSpaceAmenities || [],
        electricitySupply: {
          powerLoad: details.electricitySupply?.powerLoad || 0,
          backup: details.electricitySupply?.backup || false
        },
        waterAvailability: details.waterAvailability || '',
        propertyAge: details.propertyAge || '',
        propertyCondition: details.propertyCondition || ''
      }
    });
  };

  const handleRentChange = (rent: Record<string, any>) => {
    setFormData({
      ...formData,
      rentalTerms: {
        ...formData.rentalTerms,
        rentDetails: {
          expectedRent: rent.expectedRent || 0,
          isNegotiable: rent.isNegotiable || false,
          rentType: rent.rentType || 'inclusive'
        }
      }
    });
  };

  const handleMaintenanceAmountChange = (maintenance: Record<string, any>) => {
    setFormData({
      ...formData,
      rentalTerms: {
        ...formData.rentalTerms,
        maintenanceAmount: {
          amount: maintenance.amount || 0,
          frequency: maintenance.frequency || 'monthly'
        }
      }
    });
  };

  const handleSecurityDepositChange = (deposit: Record<string, any>) => {
    setFormData({
      ...formData,
      rentalTerms: {
        ...formData.rentalTerms,
        securityDeposit: {
          amount: deposit.amount || 0
        }
      }
    });
  };

  const handleOtherChargesChange = (charges: Record<string, any>) => {
    setFormData({
      ...formData,
      rentalTerms: {
        ...formData.rentalTerms,
        otherCharges: {
          water: {
            amount: charges.water?.amount || 0,
            type: charges.water?.type || 'inclusive'
          },
          electricity: {
            amount: charges.electricity?.amount || 0,
            type: charges.electricity?.type || 'inclusive'
          },
          gas: {
            amount: charges.gas?.amount || 0,
            type: charges.gas?.type || 'inclusive'
          },
          others: {
            amount: charges.others?.amount || 0,
            type: charges.others?.type || 'inclusive'
          }
        }
      }
    });
  };

  const handleBrokerageChange = (brokerage: Record<string, any>) => {
    setFormData({
      ...formData,
      brokerage: {
        required: brokerage.required || 'no',
        amount: brokerage.amount || 0
      }
    });
  };

  const handleAvailabilityChange = (availability: { type: 'immediate' | 'specific'; date?: string | undefined; }) => {
    setFormData({
      ...formData,
      availability: {
        type: availability.type || 'immediate',
        date: availability.date || new Date().toISOString()
      }
    });
  };

  const handleContactChange = (contact: Record<string, any>) => {
    setFormData({
      ...formData,
      contactInformation: {
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        alternatePhone: contact.alternatePhone || '',
        bestTimeToContact: contact.bestTimeToContact || ''
      }
    });
  };

  const handleMediaChange = (media: Record<string, any>) => {
    const photos: Record<string, File[]> = {};
    media.images.forEach(({ category, files }: { category: string; files: { file: File }[] }) => {
      photos[category] = files.map(f => f.file);
    });

    setFormData({
      ...formData,
      media: {
        photos: {
          exterior: photos.exterior || [],
          interior: photos.interior || [],
          floorPlan: photos.floorPlan || [],
          washrooms: photos.washrooms || [],
          lifts: photos.lifts || [],
          emergencyExits: photos.emergencyExits || []
        },
        videoTour: media.video?.file || null,
        documents: media.documents?.map((d: { file: File }) => d.file) || []
      }
    });
  };

  const handleChange = (key: string, value: any) => {
    setFormData(prev => {
      const keys = key.split('.');
      if (keys.length > 1) {
        const newData = { ...prev };
        let current: any = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newData;
      }
      return { ...prev, [key]: value };
    });
  };

  const formSections = [
    {
      title: 'Basic Information',
      icon: <MapPin className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="relative">
            <PropertyName
              propertyName={formData.basicInformation.title}
              onPropertyNameChange={handlePropertyNameChange}
            />
            <Warehouse className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <WarehouseType
            onWarehouseTypeChange={handleWarehouseTypeChange}
          />
          <CommercialPropertyAddress
            address={formData.basicInformation.address}
            onAddressChange={handleAddressChange}
          />
          <MapLocation
            latitude={formData.basicInformation.location.latitude.toString()}
            longitude={formData.basicInformation.location.longitude.toString()}
            landmark={formData.basicInformation.landmark}
            onLocationChange={(location) => handleChange('basicInformation.location', location)}
            onAddressChange={(address) => handleChange('basicInformation.address', address)}
            onLandmarkChange={(landmark) => handleChange('basicInformation.landmark', landmark)}
          />
          {/* <div className="relative">
            <Landmark
              onLandmarkChange={handleLandmarkChange}
              onLocationSelect={handleLocationChange}
            />
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div> */}

          <div className="flex items-center space-x-2 cursor-pointer">
            <CornerProperty
              isCornerProperty={formData.basicInformation.isCornerProperty}
              onCornerPropertyChange={handleCornerPropertyChange}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Property Details',
      icon: <Building2 className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <WarehouseDetails
            onDetailsChange={handleWarehouseDetailsChange}
          />
          <CommercialPropertyDetails
            onDetailsChange={handlePropertyDetailsChange}
          />
        </div>
      )
    },
    {
      title: 'Rental Terms',
      icon: <DollarSign className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <Rent
            rentDetails={formData.rentalTerms.rentDetails}
            onRentChange={handleRentChange}
          />
          {formData.rentalTerms.rentDetails.rentType === 'exclusive' && (
            <MaintenanceAmount
              maintenanceAmount={formData.rentalTerms.maintenanceAmount}
              onMaintenanceAmountChange={handleMaintenanceAmountChange}
            />
          )}
          <SecurityDeposit
            deposit={formData.rentalTerms.securityDeposit}
            onSecurityDepositChange={handleSecurityDepositChange}
          />
          <OtherCharges
            otherCharges={formData.rentalTerms.otherCharges}
            onOtherChargesChange={(charges) => setFormData(prev => ({
              ...prev,
              rentalTerms: {
                ...prev.rentalTerms,
                otherCharges: {
                  water: { type: charges.water.type, amount: charges.water.amount },
                  electricity: { type: charges.electricity.type, amount: charges.electricity.amount },
                  gas: { type: charges.gas.type, amount: charges.gas.amount },
                  others: { type: charges.others.type, amount: charges.others.amount }
                }
              }
            }))}
          />
          <Brokerage
            bro={formData.brokerage}
            onBrokerageChange={handleBrokerageChange}
          />
        </div>
      )
    },
    {
      title: 'Availability',
      icon: <Calendar className="w-6 h-6" />,
      content: (
        <div className="bg-gray-100 rounded-xl p-8 shadow-md border border-black/20 transition-all duration-300 hover:shadow-lg">
          <AvailabilityDate
            availability={{
              type: formData.availability.type as "immediate" | "specific",
              date: formData.availability.date
            }}
            onAvailabilityChange={handleAvailabilityChange}
          />
        </div>
      )
    },
    {
      title: 'Contact Information',
      icon: <User className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <CommercialContactDetails
            contactInformation={formData.contactInformation}
            onContactChange={handleContactChange}
          />
        </div>
      )
    },
    {
      title: 'Property Media',
      icon: <Image className="w-6 h-6" />,
      content: (
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
              const photos: Record<string, File[]> = {};
              media.photos.forEach(({ category, files }: { category: string, files: { url: string, file: File }[] }) => {
                photos[category] = files.map(f => f.file);
              });

              setFormData(prev => ({
                ...prev,
                media: {
                  ...prev.media,
                  photos: {
                    ...prev.media.photos,
                    ...photos
                  },
                  videoTour: media.videoTour || null,
                  documents: media.documents
                }
              }));
            }}
          />
        </div>
      )
    }
  ];

  // Simple validation function
  const validateCurrentStep = () => {
    // For simplicity, just return true
    // In a real implementation, this would validate the fields in the current step
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < formSections.length - 1) {
        setCurrentStep(currentStep + 1);
        // Scroll to top of the form
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
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of the form
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

  const handleSubmit = async (e: React.FormEvent) => {
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
        console.log(formData)

        const transformedData = {
          ...formData,
          media: convertedMedia,
          metadata: {
            ...formData.metadata,
            createdBy: author,
            createdAt: new Date(),
            propertyType: 'Commercial',
            propertyName: 'Warehouse',
            intent: 'Rent',
            status: 'Available',
          }
        };


        console.log(transformedData);
        const response = await axios.post('https://backend-sgxi.onrender.com/api/commercial/rent/warehouses', transformedData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data)

        if (response.data.success) {
          toast.success('Commercial warehouse listing created successfully!');
        }
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to create commercial shop listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
    // console.log(formData);
  };

  return (
    <div ref={formRef} className="min-h-screen bg-white">
      {/* Progress Steps */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              {formSections.map((section, index) => (
                <div
                  key={index}
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    setCurrentStep(index);
                    // Scroll to top of the form when clicking on progress indicators
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
                  }}
                >
                  <div className="flex flex-col items-center group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${index <= currentStep
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}>
                      {section.icon}
                    </div>
                    <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${index <= currentStep
                      ? 'text-black'
                      : 'text-gray-500 group-hover:text-gray-700'
                      }`}>
                      {section.title}
                    </span>
                  </div>
                  {index < formSections.length - 1 && (
                    <div className="flex items-center mx-1">
                      <div className={`w-12 h-1 transition-colors duration-200 ${index < currentStep ? 'bg-black' : 'bg-gray-200'
                        }`} />
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
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Rent Commercial Warehouse</h1>
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">{formSections[currentStep].title}</h2>
          <p className="text-gray-600">Please fill in the details for your property</p>
        </div>

        {formSections[currentStep].content}
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
            onClick={currentStep === formSections.length - 1 ? handleSubmit : handleNext}
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
                {currentStep === formSections.length - 1 ? 'Submit' : 'Next'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentWarehouse;
