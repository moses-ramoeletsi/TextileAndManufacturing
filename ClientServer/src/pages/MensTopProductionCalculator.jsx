import React, { useState } from 'react';
import { Calculator, Ruler, Shirt } from 'lucide-react';

const MensTopProductionCalculator = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [topStyle, setTopStyle] = useState('crew');
  const [fabricLength, setFabricLength] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({
    'XS': false, 'S': false, 'M': false, 'L': false, 'XL': false,
    '2XL': false, '3XL': false, '4XL': false, '5XL': false
  });
  const [quantities, setQuantities] = useState({
    'XS': 0, 'S': 0, 'M': 0, 'L': 0, 'XL': 0,
    '2XL': 0, '3XL': 0, '4XL': 0, '5XL': 0
  });

  const fabricRequirements = {
    crew: {
      'XS': 145, 'S': 145, 'M': 145, 'L': 145, 'XL': 145,
      '2XL': 150, '3XL': 155, '4XL': 165, '5XL': 175
    },
    hoodie: {
      'XS': 160, 'S': 160, 'M': 160, 'L': 160, 'XL': 160,
      '2XL': 165, '3XL': 175, '4XL': 185, '5XL': 195
    }
  };

  const sizeChart = {
    'XS': { waist: 125, chest: 105, hip: 105 },
    'S': { waist: 130, chest: 110, hip: 110 },
    'M': { waist: 135, chest: 115, hip: 115 },
    'L': { waist: 140, chest: 120, hip: 120 },
    'XL': { waist: 145, chest: 125, hip: 125 },
    '2XL': { waist: 150, chest: 130, hip: 130 },
    '3XL': { waist: 155, chest: 135, hip: 135 },
    '4XL': { waist: 160, chest: 140, hip: 140 },
    '5XL': { waist: 165, chest: 145, hip: 145 }
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [size]: !prev[size]
    }));
  };

  const handleQuantityChange = (size, value) => {
    const newValue = Math.max(0, parseInt(value) || 0);
    setQuantities(prev => ({
      ...prev,
      [size]: newValue
    }));
  };

  const calculateProductionAndWaste = () => {
    const availableFabric = parseInt(fabricLength);
    if (!availableFabric) return { production: {}, waste: 0, totalUsed: 0 };
    const requirements = fabricRequirements[topStyle];
    let remainingFabric = availableFabric;
    const production = {};
    let totalFabricUsed = 0;

    Object.entries(requirements).forEach(([size, required]) => {
      if (selectedSizes[size]) {
        const pieces = Math.floor(remainingFabric / (required + 30)); // Adding 30cm for ribbing
        if (pieces > 0) {
          production[size] = pieces;
          const fabricUsed = pieces * (required + 30);
          totalFabricUsed += fabricUsed;
          remainingFabric -= fabricUsed;
        } else {
          production[size] = 0;
        }
      }
    });

    return {
      production,
      waste: remainingFabric,
      totalUsed: totalFabricUsed
    };
  };

  const calculateMaterialRequirements = () => {
    const requirements = fabricRequirements[topStyle];
    let totalFabric = 0;
    let totalRibbing = 0;
    const sizeBreakdown = {};

    Object.entries(quantities).forEach(([size, quantity]) => {
      if (quantity > 0) {
        const mainFabric = requirements[size] * quantity;
        const ribbingNeeded = 30 * quantity; // 30cm ribbing per piece
        totalFabric += mainFabric;
        totalRibbing += ribbingNeeded;
        sizeBreakdown[size] = {
          mainFabric,
          ribbing: ribbingNeeded,
          total: mainFabric + ribbingNeeded
        };
      }
    });

    return { totalFabric, totalRibbing, sizeBreakdown };
  };

  const { production, waste, totalUsed } = calculateProductionAndWaste();
  const { totalFabric, totalRibbing, sizeBreakdown } = calculateMaterialRequirements();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Shirt className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Men's Crew/Hoodie Top Calculator</h1>
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Style
            </label>
            <select
              value={topStyle}
              onChange={(e) => setTopStyle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="crew">Crew Neck (Top A)</option>
              <option value="hoodie">Hoodie (Top B)</option>
            </select>
          </div>

          {/* Tab Buttons */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('available')}
              className={`flex items-center justify-center w-1/2 py-2 px-4 rounded-md transition-all ${
                activeTab === 'available'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Available Fabric
            </button>
            <button
              onClick={() => setActiveTab('required')}
              className={`flex items-center justify-center w-1/2 py-2 px-4 rounded-md transition-all ${
                activeTab === 'required'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Ruler className="w-4 h-4 mr-2" />
              Required Fabric
            </button>
          </div>

          {/* Available Fabric Tab Content */}
          {activeTab === 'available' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Fabric (cm)
                </label>
                <input
                  type="number"
                  value={fabricLength}
                  onChange={(e) => setFabricLength(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  min="0"
                  placeholder="Enter fabric length"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Sizes to Produce
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.keys(sizeChart).map((size) => (
                    <label
                      key={size}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSizes[size]}
                        onChange={() => handleSizeToggle(size)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">{size}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {fabricRequirements[topStyle][size]}+30cm
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {fabricLength && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(production).map(([size, quantity]) => (
                      <div key={size} className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-blue-900">Size {size}</span>
                          <span className="text-blue-700">{quantity} pieces</span>
                        </div>
                        <div className="text-sm text-blue-600">
                          Main Fabric: {quantity * fabricRequirements[topStyle][size]} cm
                        </div>
                        <div className="text-sm text-blue-600">
                          Ribbing: {quantity * 30} cm
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-4">Material Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-green-800">
                        <span>Total Available:</span>
                        <span>{fabricLength} cm</span>
                      </div>
                      <div className="flex justify-between text-green-800">
                        <span>Total Used:</span>
                        <span>{totalUsed} cm</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Waste:</span>
                        <span>{waste} cm</span>
                      </div>
                      <div className="flex justify-between text-blue-600 font-medium">
                        <span>Efficiency:</span>
                        <span>
                          {fabricLength ? Math.round((totalUsed / parseInt(fabricLength)) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Required Fabric Tab Content */}
          {activeTab === 'required' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(quantities).map((size) => (
                  <div key={size} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <label className="w-16 text-sm font-medium">Size {size}:</label>
                    <input
                      type="number"
                      value={quantities[size] || ''}
                      onChange={(e) => handleQuantityChange(size, e.target.value)}
                      className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      min="0"
                      placeholder="0"
                    />
                    <div className="ml-3 text-xs text-gray-600">
                      <div>Main: {fabricRequirements[topStyle][size]} cm</div>
                      <div>Ribbing: 30 cm</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-4">Material Requirements</h3>
                <div className="space-y-3">
                  {Object.entries(sizeBreakdown).map(([size, fabric]) => (
                    fabric.total > 0 && (
                      <div key={size} className="space-y-1">
                        <div className="flex justify-between text-blue-800">
                          <span>Size {size} ({quantities[size]} pcs):</span>
                          <span>{fabric.total} cm total</span>
                        </div>
                        <div className="flex justify-between text-sm text-blue-600">
                          <span className="pl-4">Main Fabric:</span>
                          <span>{fabric.mainFabric} cm</span>
                        </div>
                        <div className="flex justify-between text-sm text-blue-600">
                          <span className="pl-4">Ribbing:</span>
                          <span>{fabric.ribbing} cm</span>
                        </div>
                      </div>
                    )
                  ))}
                  <div className="pt-4 border-t border-blue-200">
                    <div className="flex justify-between font-medium text-blue-900">
                      <span>Total Main Fabric:</span>
                      <span>{totalFabric} cm</span>
                    </div>
                    <div className="flex justify-between text-blue-900 mt-1">
                      <span>Total Ribbing:</span>
                      <span>{totalRibbing} cm</span>
                    </div>
                    <div className="flex justify-between font-medium text-blue-900 mt-1">
                      <span>Total Required:</span>
                      <span>{totalFabric + totalRibbing} cm</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-700 mt-1">
                      <span>In meters:</span>
                      <span>{((totalFabric + totalRibbing) / 100).toFixed(2)} m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

<div className="mt-6 bg-gray-50 rounded-lg overflow-hidden">
            <h4 className="font-medium text-gray-900 p-4 bg-gray-100">Size Chart (cm)</h4>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Size</th>
                    <th className="p-2 text-right">Chest</th>
                    <th className="p-2 text-right">Waist</th>
                    <th className="p-2 text-right">Hip</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sizeChart).map(([size, measurements]) => (
                    <tr key={size} className="border-t border-gray-200">
                      <td className="p-2 font-medium">{size}</td>
                      <td className="p-2 text-right">{measurements.chest}</td>
                      <td className="p-2 text-right">{measurements.waist}</td>
                      <td className="p-2 text-right">{measurements.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Important Notes</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                All measurements assume 140cm fabric width
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                Each size requires 30cm additional ribbing
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                Use two-way stretch fabric for optimal fit
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                Recommended needle size: US 8 (5 mm)
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                Consider ordering 10% extra fabric for pattern matching
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                Ensure proper topstitching and seam alignment
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MensTopProductionCalculator;