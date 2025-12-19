'use client';

import { useState } from 'react';
import { Tractor } from '@/types/tractor';
import { Settings, Gauge, Droplets, Zap, Ruler, Container, ExternalLink, FileText, BookOpen, Wrench, Package } from 'lucide-react';

interface TractorSpecsTabsProps {
  tractor: Tractor;
}

type TabId = 'engine' | 'transmission' | 'hydraulics' | 'pto' | 'dimensions' | 'capacities';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'engine', label: 'Engine', icon: <Settings className="w-5 h-5" /> },
  { id: 'transmission', label: 'Transmission', icon: <Gauge className="w-5 h-5" /> },
  { id: 'hydraulics', label: 'Hydraulics', icon: <Droplets className="w-5 h-5" /> },
  { id: 'pto', label: 'PTO', icon: <Zap className="w-5 h-5" /> },
  { id: 'dimensions', label: 'Dimensions', icon: <Ruler className="w-5 h-5" /> },
  { id: 'capacities', label: 'Capacities', icon: <Container className="w-5 h-5" /> },
];

export default function TractorSpecsTabs({ tractor }: TractorSpecsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('engine');

  const renderSpecRow = (label: string, value: string | number | undefined, unit?: string) => {
    if (value === undefined || value === null || value === '') return null;
    return (
      <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <dt className="text-gray-600 font-medium">{label}</dt>
        <dd className="font-semibold text-gray-900 text-right">
          {typeof value === 'number' ? value.toLocaleString() : value} {unit || ''}
        </dd>
      </div>
    );
  };

  const renderEngineSpecs = () => {
    const { engine } = tractor;
    const hasData = engine.cylinders > 0 || engine.powerHP > 0;
    
    if (!hasData) {
      return <p className="text-gray-500">No engine data available.</p>;
    }

    return (
      <div className="space-y-1">
        {renderSpecRow('Manufacturer', engine.manufacturer)}
        {renderSpecRow('Model', engine.model)}
        {engine.cylinders > 0 && renderSpecRow('Cylinders', engine.cylinders)}
        {renderSpecRow('Displacement', engine.displacement, 'L')}
        {engine.bore && engine.stroke && renderSpecRow('Bore × Stroke', `${engine.bore} mm × ${engine.stroke} mm`)}
        {renderSpecRow('Maximum Power', engine.powerHP, 'HP')}
        {renderSpecRow('Maximum Power (kW)', engine.powerKW, 'kW')}
        {engine.powerHPNominal && engine.powerRPM && renderSpecRow('Nominal Power', `${engine.powerHPNominal} HP @ ${engine.powerRPM} rpm`)}
        {engine.torqueMax && engine.torqueRPM && renderSpecRow('Maximum Torque', `${engine.torqueMax} Nm @ ${engine.torqueRPM} rpm`)}
        {renderSpecRow('Torque Reserve', engine.torqueReserve, '%')}
        {renderSpecRow('Fuel System', engine.fuelSystem)}
        {renderSpecRow('Aspiration', engine.aspiration)}
        {renderSpecRow('Emissions Standard', engine.emissions)}
        {renderSpecRow('Fuel Type', engine.fuelType.charAt(0).toUpperCase() + engine.fuelType.slice(1))}
        {renderSpecRow('Cooling', engine.cooling.charAt(0).toUpperCase() + engine.cooling.slice(1))}
        {engine.turbocharged !== undefined && renderSpecRow('Turbocharged', engine.turbocharged ? 'Yes' : 'No')}
      </div>
    );
  };

  const renderTransmissionSpecs = () => {
    const { transmission, ptoHP, ptoRPM } = tractor;
    const hasData = transmission.type || transmission.gears || ptoHP || ptoRPM;
    
    if (!hasData) {
      return <p className="text-gray-500">No transmission data available.</p>;
    }

    return (
      <div className="space-y-1">
        {transmission.type && renderSpecRow('Type', transmission.type.charAt(0).toUpperCase() + transmission.type.slice(1))}
        {renderSpecRow('Gears', transmission.gears)}
        {transmission.description && (
          <div className="py-2 border-b border-gray-100">
            <dt className="text-gray-600 font-medium mb-2">Description</dt>
            <dd className="font-semibold text-gray-900">{transmission.description}</dd>
          </div>
        )}
        {ptoHP && renderSpecRow('PTO Power', ptoHP, 'HP')}
        {ptoRPM && renderSpecRow('PTO Speed', `${ptoRPM} rpm`)}
      </div>
    );
  };

  const renderHydraulicsSpecs = () => {
    const { hydraulicSystem } = tractor;
    if (!hydraulicSystem) return <p className="text-gray-500">No hydraulic system data available.</p>;
    return (
      <div className="space-y-1">
        {renderSpecRow('Pump Flow', hydraulicSystem.pumpFlow, 'L/min')}
        {renderSpecRow('Steering Flow', hydraulicSystem.steeringFlow, 'L/min')}
        {renderSpecRow('Lift Capacity', hydraulicSystem.liftCapacity, 'kg')}
        {renderSpecRow('Valves', hydraulicSystem.valves)}
        {renderSpecRow('Category', hydraulicSystem.category)}
      </div>
    );
  };

  const renderPTOSpecs = () => {
    const { ptoHP, ptoRPM } = tractor;
    if (!ptoHP && !ptoRPM) return <p className="text-gray-500">No PTO data available.</p>;
    return (
      <div className="space-y-1">
        {renderSpecRow('PTO Power', ptoHP, 'HP')}
        {renderSpecRow('PTO Speed', ptoRPM ? `${ptoRPM} rpm` : undefined)}
        {ptoRPM === 540 && <p className="text-sm text-gray-500 mt-2">Standard 540 rpm PTO</p>}
        {ptoRPM === 1000 && <p className="text-sm text-gray-500 mt-2">Standard 1000 rpm PTO</p>}
      </div>
    );
  };

  const renderDimensionsSpecs = () => {
    const { dimensions } = tractor;
    if (!dimensions) return <p className="text-gray-500">No dimensions data available.</p>;
    return (
      <div className="space-y-1">
        {renderSpecRow('Length', dimensions.length, 'mm')}
        {renderSpecRow('Width', dimensions.width, 'mm')}
        {renderSpecRow('Height', dimensions.height, 'mm')}
        {renderSpecRow('Wheelbase', dimensions.wheelbase, 'mm')}
        {renderSpecRow('Ground Clearance', dimensions.groundClearance, 'mm')}
        {tractor.weight && renderSpecRow('Weight', tractor.weight, 'kg')}
      </div>
    );
  };

  const renderCapacitiesSpecs = () => {
    const { capacities } = tractor;
    if (!capacities) return <p className="text-gray-500">No capacities data available.</p>;
    return (
      <div className="space-y-1">
        {renderSpecRow('Fuel Tank', capacities.fuelTank, 'L')}
        {renderSpecRow('Hydraulic Reservoir', capacities.hydraulicReservoir, 'L')}
        {renderSpecRow('Coolant', capacities.coolant, 'L')}
        {renderSpecRow('Engine Oil', capacities.engineOil, 'L')}
        {renderSpecRow('Transmission Oil', capacities.transmissionOil, 'L')}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'engine':
        return renderEngineSpecs();
      case 'transmission':
        return renderTransmissionSpecs();
      case 'hydraulics':
        return renderHydraulicsSpecs();
      case 'pto':
        return renderPTOSpecs();
      case 'dimensions':
        return renderDimensionsSpecs();
      case 'capacities':
        return renderCapacitiesSpecs();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-2 px-6 pt-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${isActive
                    ? 'bg-primary-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <dl className="space-y-0">
          {renderTabContent()}
        </dl>

        {/* Documentation Links */}
        {(tractor.documentation || tractor.brandWebsite) && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Documentation & Resources</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tractor.documentation?.technicalCatalog && (
                <a
                  href={tractor.documentation.technicalCatalog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-700 hover:text-primary-800 hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  <span>Technical Catalog</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {tractor.documentation?.operatorManual && (
                <a
                  href={tractor.documentation.operatorManual}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-700 hover:text-primary-800 hover:underline"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Operator Manual</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {tractor.documentation?.serviceManual && (
                <a
                  href={tractor.documentation.serviceManual}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-700 hover:text-primary-800 hover:underline"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Service Manual</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {tractor.documentation?.partsCatalog && (
                <a
                  href={tractor.documentation.partsCatalog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-700 hover:text-primary-800 hover:underline"
                >
                  <Package className="w-4 h-4" />
                  <span>Parts Catalog</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {tractor.documentation?.manufacturerPage && (
                <a
                  href={tractor.documentation.manufacturerPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-700 hover:text-primary-800 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Manufacturer Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {tractor.brandWebsite && (
                <a
                  href={tractor.brandWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-700 hover:text-primary-800 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Brand Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
