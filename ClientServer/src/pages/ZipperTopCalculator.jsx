import React, { useState } from 'react';
import { Calculator, Ruler, Shirt } from 'lucide-react';

const ZipperTopCalculator = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [fabricType, setFabricType] = useState('brushed_cotton');
  const [fabricLength, setFabricLength] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({
    'S': false, 'M': false, 'L': false, 'XL': false, '2XL': false, '3XL': false
  });
  const [quantities, setQuantities] = useState({
    'S': 0, 'M': 0, 'L': 0, 'XL': 0, '2XL': 0, '3XL': 0
  });

  const fabricRequirements = {
    'S': 200, // 2m in cm
    'M': 200,
    'L': 250,
    'XL': 250,
    '2XL': 250,
    '3XL': 250
  };

  const zipperLengths = {
    'S': 55,
    'M': 60,
    'L': 65,
    'XL': 70,
    '2XL': 75,
    '3XL': 80
  };

  const sizeChart = {
    'S': { chest: '82-87', waist: '71-77' },
    'M': { chest: '92-97', waist: '82-87' },
    'L': { chest: '102-107', waist: '92-97' },
    'XL': { chest: '112-117', waist: '102-107' },
    '2XL': { chest: '122-127', waist: '112-117' },
    '3XL': { chest: '132-137', waist: '122-127' }
  };

  const fabricTypes = {
    brushed_cotton: 'Brushed Cotton Knit Tracksuiting',
    double_knit: 'Double Knit',
    quantex: 'Quantex',
    polar_fleece: 'Polar Fleece',
    tricartate: 'Tricartate'
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
    let remainingFabric = availableFabric;
    const production = {};
    let totalFabricUsed = 0;

    Object.entries(fabricRequirements).forEach(([size, required]) => {
      if (selectedSizes[size]) {
        const pieces = Math.floor(remainingFabric / required);
        if (pieces > 0) {
          production[size] = pieces;
          const fabricUsed = pieces * required;
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
    let totalFabric = 0;
    const sizeBreakdown = {};
    const zipperBreakdown = {};

    Object.entries(quantities).forEach(([size, quantity]) => {
      if (quantity > 0) {
        const fabricNeeded = fabricRequirements[size] * quantity;
        totalFabric += fabricNeeded;
        sizeBreakdown[size] = fabricNeeded;
        zipperBreakdown[size] = {
          quantity,
          length: zipperLengths[size],
          total: quantity * zipperLengths[size]
        };
      }
    });

    return { totalFabric, sizeBreakdown, zipperBreakdown };
  };

  const { production, waste, totalUsed } = calculateProductionAndWaste();
  const { totalFabric, sizeBreakdown, zipperBreakdown } = calculateMaterialRequirements();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Shirt className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Zipper Top Production Calculator</h1>
          </div>

          {/* Fabric Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fabric Type
            </label>
            <select
              value={fabricType}
              onChange={(e) => setFabricType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {Object.entries(fabricTypes).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
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
              Required Materials
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
                  {Object.keys(fabricRequirements).map((size) => (
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
                          Fabric: {quantity * fabricRequirements[size]} cm
                          <br />
                          Zipper: {zipperLengths[size]} cm each
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

          {/* Required Materials Tab Content */}
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
                    <div className="ml-3 text-sm text-gray-600">
                      <div>Fabric: {fabricRequirements[size]} cm</div>
                      <div>Zipper: {zipperLengths[size]} cm</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-4">Material Requirements</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-800">Fabric Requirements:</h4>
                    {Object.entries(sizeBreakdown).map(([size, fabric]) => (
                      fabric > 0 && (
                        <div key={size} className="flex justify-between text-blue-800">
                          <span>Size {size} ({quantities[size]} pcs):</span>
                          <span>{fabric} cm</span>
                        </div>
                      )
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-800">Zipper Requirements:</h4>
                    {Object.entries(zipperBreakdown).map(([size, data]) => (
                      data.quantity > 0 && (
                        <div key={size} className="flex justify-between text-blue-800">
                          <span>Size {size} ({data.quantity} pcs):</span>
                          <span>{data.total} cm total ({data.length} cm each)</span>
                        </div>
                      )
                    ))}
                  </div>

                  <div className="pt-4 border-t border-blue-200">
                    <div className="flex justify-between font-medium text-blue-900">
                      <span>Total Fabric Required:</span>
                      <span>{totalFabric} cm</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-700 mt-1">
                      <span>In meters:</span>
                      <span>{(totalFabric / 100).toFixed(2)} m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Size Chart */}
          <div className="mt-6 bg-gray-50 p-6 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Size Chart</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Size</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Chest (cm)</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Waist (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(sizeChart).map(([size, measurements]) => (
                    <tr key={size}>
                      <td className="px-4 py-2 text-sm text-gray-900">{size}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{measurements.chest}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{measurements.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Important Notes</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-800 mb-2">Recommended Fabrics:</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Brushed cotton knit tracksuiting
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Double knit
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Quantex
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Polar fleeces
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Tricartate
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-800 mb-2">Required Needles:</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Ballpoint needles for over-locking/serging machines
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    4mm twin needles for decorative top stitching
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Universal needles for woven fabrics like Quantex
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-800 mb-2">Additional Notes:</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Calculations assume 150cm fabric width
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Consider ordering 10% extra fabric for safety margin
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Double-check zipper lengths against your pattern
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Use the best quality fabric you can afford
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZipperTopCalculator;