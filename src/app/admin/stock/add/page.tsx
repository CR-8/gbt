"use client"

import { useState } from 'react'
import { AdminLayout } from '@/modules/layouts'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, Save, X } from "lucide-react"

export default function AddStockPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    quantity: '',
    minStock: '',
    maxStock: '',
    unitPrice: '',
    totalCost: '',
    supplier: '',
    supplierContact: '',
    location: '',
    barcode: '',
    serialNumber: '',
    purchaseDate: '',
    warrantyPeriod: '',
    condition: 'new',
    isConsumable: false,
    requiresCalibration: false,
    tags: [] as string[]
  })

  const [newTag, setNewTag] = useState('')

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'mechanical', label: 'Mechanical Parts' },
    { value: 'tools', label: 'Tools & Equipment' },
    { value: 'consumables', label: 'Consumables' },
    { value: 'safety', label: 'Safety Equipment' },
    { value: 'software', label: 'Software & Licenses' }
  ]

  const subcategories = {
    electronics: ['Microcontrollers', 'Sensors', 'Motors', 'Power Supplies', 'Cables', 'PCBs'],
    mechanical: ['Frames', 'Gears', 'Bearings', 'Fasteners', 'Wheels', 'Joints'],
    tools: ['Soldering Equipment', 'Measurement Tools', 'Hand Tools', 'Power Tools'],
    consumables: ['Wires', 'Solder', 'Screws', 'Batteries', 'Tape', 'Adhesives'],
    safety: ['Goggles', 'Gloves', 'First Aid', 'Fire Safety'],
    software: ['Design Software', 'Programming Tools', 'Simulation Software']
  }

  const suppliers = [
    'ElectroLab India',
    'RoboSpark Technologies', 
    'TechShop Electronics',
    'Industrial Supplies Co.',
    'MakerSpace Distributors',
    'Component Warehouse'
  ]

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Add New Stock Item</h1>
            <p className="text-muted-foreground">
              Add new items to your inventory management system
            </p>
          </div>
          <Button variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Essential details about the stock item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Arduino Uno R3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, subcategory: '' }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select value={formData.subcategory} onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.category && subcategories[formData.category as keyof typeof subcategories]?.map((subcat) => (
                          <SelectItem key={subcat} value={subcat}>
                            {subcat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the item..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" size="sm" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Details */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Details</CardTitle>
                <CardDescription>
                  Quantity and stock management information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minStock">Min Stock</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxStock">Max Stock</Label>
                    <Input
                      id="maxStock"
                      type="number"
                      value={formData.maxStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxStock: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice">Unit Price (₹) *</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      step="0.01"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalCost">Total Cost (₹)</Label>
                    <Input
                      id="totalCost"
                      type="number"
                      step="0.01"
                      value={formData.totalCost || (parseFloat(formData.unitPrice || '0') * parseFloat(formData.quantity || '0')).toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, totalCost: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Storage Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Shelf A-1, Room 203"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode/SKU</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                      placeholder="Scan or enter barcode"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                      placeholder="Enter serial number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supplier Information */}
            <Card>
              <CardHeader>
                <CardTitle>Supplier Information</CardTitle>
                <CardDescription>
                  Purchase and supplier details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select value={formData.supplier} onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplierContact">Supplier Contact</Label>
                  <Input
                    id="supplierContact"
                    value={formData.supplierContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplierContact: e.target.value }))}
                    placeholder="Phone/Email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warrantyPeriod">Warranty (months)</Label>
                    <Input
                      id="warrantyPeriod"
                      type="number"
                      value={formData.warrantyPeriod}
                      onChange={(e) => setFormData(prev => ({ ...prev, warrantyPeriod: e.target.value }))}
                      placeholder="12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Additional Properties */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Properties</CardTitle>
                <CardDescription>
                  Special characteristics and requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isConsumable" 
                    checked={formData.isConsumable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isConsumable: checked as boolean }))}
                  />
                  <Label htmlFor="isConsumable">This is a consumable item</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="requiresCalibration" 
                    checked={formData.requiresCalibration}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresCalibration: checked as boolean }))}
                  />
                  <Label htmlFor="requiresCalibration">Requires periodic calibration</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Add to Inventory
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}