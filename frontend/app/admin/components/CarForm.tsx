"use client"

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import DealerSelector from './DealerSelector'

interface CarFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
  dealers: Dealer[]
  isLoading?: boolean
  editingCar?: any
}

interface Dealer {
  id: number
  name: string
  owner: string
  phone: string
  email: string
  address: string
}

interface CarMakesData {
  makes: Array<{
    id: string
    name: string
    models: string[]
  }>
}

export default function CarForm({
  isOpen,
  onClose,
  onSubmit,
  dealers,
  isLoading = false,
  editingCar,
}: CarFormProps) {
  const [selectedDealer, setSelectedDealer] = useState<number | null>(
    editingCar?.dealerId || null
  )
  const [dealerSearchTerm, setDealerSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [mainIndex, setMainIndex] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const [carMakes, setCarMakes] = useState<CarMakesData['makes']>([])
  const [selectedMake, setSelectedMake] = useState<string>(editingCar?.make || '')
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [useCustomMake, setUseCustomMake] = useState<boolean>(!carMakes.find(m => m.name === editingCar?.make))
  const [useCustomModel, setUseCustomModel] = useState<boolean>(!availableModels.includes(editingCar?.model))
  const [customMake, setCustomMake] = useState<string>(editingCar?.make || '')
  const [customModel, setCustomModel] = useState<string>(editingCar?.model || '')

  // Load car makes data
  useEffect(() => {
    const loadCarMakes = async () => {
      try {
        const res = await fetch('/data/carMakes.json')
        const data: CarMakesData = await res.json()
        setCarMakes(data.makes)
        
        // If editing, set available models for selected make
        if (editingCar?.make) {
          const makeData = data.makes.find(m => m.name === editingCar.make)
          if (makeData) {
            setAvailableModels(makeData.models)
            setUseCustomModel(!makeData.models.includes(editingCar.model))
          } else {
            setUseCustomMake(true)
            setCustomMake(editingCar.make)
          }
        }
      } catch (e) {
        console.error('Failed to load car makes', e)
      }
    }
    loadCarMakes()
  }, [editingCar])

  const handleMakeChange = (make: string) => {
    setSelectedMake(make)
    setCustomMake(make)
    const makeData = carMakes.find(m => m.name === make)
    setAvailableModels(makeData?.models || [])
    setUseCustomModel(false)
    setCustomModel('')
  }

  if (!isOpen) return null

  const toBase64 = (file: File) =>
    new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () =>
        resolve(typeof reader.result === 'string' ? reader.result : null)
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })

  const onImagesSelected = (files: FileList | null) => {
    setUploadError(null)
    if (!files) {
      setSelectedFiles([])
      setPreviews([])
      setMainIndex(null)
      return
    }
    const arr = Array.from(files)
    if (arr.length > 10) {
      setUploadError('You can upload up to 10 images')
      arr.splice(10)
    }
    const valid: File[] = []
    const urls: string[] = []
    for (const f of arr) {
      if (!f.type.startsWith('image/')) continue
      if (f.size > 5 * 1024 * 1024) {
        setUploadError('Each image must be smaller than 5MB')
        continue
      }
      valid.push(f)
      urls.push(URL.createObjectURL(f))
    }
    previews.forEach((u) => URL.revokeObjectURL(u))
    setSelectedFiles(valid)
    setPreviews(urls)
    setUploadProgress(valid.map(() => 0))
    setMainIndex(valid.length > 0 ? 0 : null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // Add custom make if using custom
    if (useCustomMake && customMake) {
      formData.set('make', customMake)
    }

    // Add custom model if using custom
    if (useCustomModel && customModel) {
      formData.set('model', customModel)
    }

    // Add images
    for (const file of selectedFiles) {
      formData.append('images', file)
    }

    // Add dealer
    if (selectedDealer) {
      formData.append('dealerId', String(selectedDealer))
    }

    try {
      await onSubmit(formData)
      onClose()
    } catch (err) {
      console.error('Form submission error:', err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl my-4 sm:my-8 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        {/* Sticky header */}
        <div className="sticky top-0 bg-white border-b p-3 sm:p-4 md:p-6 flex justify-between items-center">
          <h3 className="text-base sm:text-lg md:text-xl font-bold">
            {editingCar ? 'Edit Car' : 'Add New Car'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Dealer selection */}
            <DealerSelector
              dealers={dealers}
              selectedDealer={selectedDealer}
              dealerSearchTerm={dealerSearchTerm}
              onDealerSearchChange={setDealerSearchTerm}
              onSelectDealer={setSelectedDealer}
              onClear={() => {
                setSelectedDealer(null)
                setDealerSearchTerm('')
              }}
            />

            {/* Basic info */}
            <div>
              <label className="text-xs sm:text-sm text-gray-700 block mb-1">Make *</label>
              {!useCustomMake ? (
                <div className="space-y-2">
                  <select
                    value={selectedMake}
                    onChange={(e) => handleMakeChange(e.target.value)}
                    className="w-full border p-2 md:p-3 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Make</option>
                    {carMakes.map((make) => (
                      <option key={make.id} value={make.name}>
                        {make.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setUseCustomMake(true)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Can't find your make? Add custom
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customMake}
                    onChange={(e) => setCustomMake(e.target.value)}
                    placeholder="Enter make name"
                    className="w-full border p-2 md:p-3 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomMake(false)
                      setSelectedMake('')
                      setCustomMake('')
                    }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Choose from list
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs sm:text-sm text-gray-700 block mb-1">Model *</label>
              {!useCustomModel && selectedMake ? (
                <div className="space-y-2">
                  <select
                    name="model"
                    required
                    defaultValue={editingCar?.model || ''}
                    className="w-full border p-2 md:p-3 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Model</option>
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setUseCustomModel(true)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Add custom model
                  </button>
                </div>
              ) : useCustomModel || !selectedMake ? (
                <div className="space-y-2">
                  <input
                    name="model"
                    type="text"
                    required
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="Enter model name"
                    className="w-full border p-2 md:p-3 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {selectedMake && (
                    <button
                      type="button"
                      onClick={() => setUseCustomModel(false)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Choose from list
                    </button>
                  )}
                </div>
              ) : null}
            </div>

            {/* Body Type */}
            <div>
              <label className="text-xs sm:text-sm text-gray-700 block mb-1">Body Type *</label>
              <select
                name="bodyType"
                required
                defaultValue={editingCar?.bodyType || ''}
                className="w-full border p-2 md:p-3 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Body Type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Bakkie">Bakkie (Pickup)</option>
                <option value="Convertible">Convertible</option>
                <option value="Panelvan">Panelvan</option>
              </select>
            </div>

            <input
              name="title"
              required
              placeholder="Title (e.g. 2023 Tesla Model S)"
              className="border p-2 md:p-3 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="price"
              type="number"
              required
              placeholder="Price (R)"
              className="border p-2 md:p-3 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="year"
              type="number"
              placeholder="Year"
              defaultValue={editingCar?.year}
              className="border p-2 md:p-3 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="mileage"
              type="number"
              placeholder="Mileage (km)"
              defaultValue={editingCar?.mileage}
              className="border p-2 md:p-3 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="location"
              placeholder="Location"
              defaultValue={editingCar?.location}
              className="border p-2 md:p-3 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Dropdowns */}
            <div>
              <label className="text-sm text-gray-700 block mb-1">Fuel Type</label>
              <select
                name="fuelType"
                defaultValue={editingCar?.fuelType || 'Petrol'}
                className="w-full border p-2 md:p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700 block mb-1">Transmission</label>
              <select
                name="transmission"
                defaultValue={editingCar?.transmission || 'Manual'}
                className="w-full border p-2 md:p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </div>

            {/* Color */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-700 block mb-1">Colour</label>
              <div className="flex items-center gap-2">
                <input
                  name="color"
                  placeholder="e.g. White"
                  defaultValue={editingCar?.color}
                  className="border p-2 md:p-3 rounded text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="color"
                  defaultValue={editingCar?.color || '#000000'}
                  onChange={(e) => {
                    const input = e.target
                      .previousElementSibling as HTMLInputElement
                    if (input) input.style.borderColor = e.target.value
                  }}
                  className="w-12 h-10 p-1 border rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Features and description */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-700 block mb-1">Features (comma separated)</label>
              <input
                name="features"
                placeholder="e.g. Sunroof, Leather seats, ABS"
                defaultValue={editingCar?.features?.join(', ')}
                className="border p-2 md:p-3 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-700 block mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Detailed description of the vehicle..."
                defaultValue={editingCar?.description}
                className="border p-2 md:p-3 rounded w-full h-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Images */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-700 block mb-1">
                Images (up to 10)
              </label>
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="border p-2 md:p-3 rounded w-full text-sm"
                onChange={(e) => onImagesSelected(e.target.files)}
              />
              {uploadError && (
                <p className="text-sm text-red-600 mt-2">{uploadError}</p>
              )}
              {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {previews.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative border rounded overflow-hidden bg-white shadow-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`preview-${idx}`}
                        className="object-cover w-full h-20"
                      />
                      <button
                        type="button"
                        onClick={() => setMainIndex(idx)}
                        className={`absolute left-1 top-1 bg-white/80 rounded-full p-0.5 ${
                          mainIndex === idx ? 'ring-2 ring-yellow-400' : ''
                        }`}
                        title="Make main"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-3 w-3 text-yellow-500"
                          fill={mainIndex === idx ? 'currentColor' : 'none'}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.165c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.176 0l-3.37 2.45c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.06 9.384c-.783-.57-.38-1.81.588-1.81h4.165a1 1 0 00.95-.69L11.05 2.927z"
                          />
                        </svg>
                      </button>
                      <div className="p-1 flex items-center justify-between text-xs">
                        <span className="truncate text-gray-600">
                          {selectedFiles[idx]?.name || ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextFiles = selectedFiles.slice()
                            nextFiles.splice(idx, 1)
                            const nextPreviews = previews.slice()
                            const removed = nextPreviews.splice(idx, 1)
                            removed.forEach((u) => URL.revokeObjectURL(u))
                            setSelectedFiles(nextFiles)
                            setPreviews(nextPreviews)
                            if (mainIndex !== null) {
                              if (idx === mainIndex)
                                setMainIndex(nextFiles.length > 0 ? 0 : null)
                              else if (idx < mainIndex)
                                setMainIndex(mainIndex - 1)
                            }
                          }}
                          className="text-red-600 hover:underline"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Featured checkbox */}
            <div className="flex items-center gap-3 md:col-span-2">
              <input
                name="isFeatured"
                type="checkbox"
                id="isFeatured"
                defaultChecked={editingCar?.isFeatured}
                className="h-4 w-4 rounded cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-sm text-gray-700">
                Mark as featured
              </label>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="sticky bottom-0 bg-white border-t p-3 sm:p-4 md:p-6 flex justify-end gap-2 sm:gap-3 mt-3 sm:mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-3 sm:px-4 md:px-6 py-2 rounded text-white font-semibold text-xs sm:text-sm ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading
                ? editingCar
                  ? 'Updating...'
                  : 'Creating...'
                : editingCar
                ? 'Update Car'
                : 'Create Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
