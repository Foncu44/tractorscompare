'use client';

import { useState } from 'react';
import { Tractor } from '@/types/tractor';
import { Settings, Gauge, Droplets, Zap, Ruler, Container, ExternalLink, FileText, BookOpen, Wrench, Package, Circle } from 'lucide-react';

type TabId = 'engine' | 'transmission' | 'hydraulics' | 'pto' | 'dimensions' | 'capacities' | 'tires';

export interface TractorSpecsTabsProps {
  tractor: Tractor;
  /** Optional "What this means" note per tab (deterministic from tractorPageContent.buildTabMeaningNotes) */
  tabMeaningNotes?: Partial<Record<TabId, string>>;
}

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
  { id: 'tires', label: 'Tires', icon: <Circle className="w-5 h-5" /> },
  { id: 'capacities', label: 'Capacities', icon: <Container className="w-5 h-5" /> },
];

export default function TractorSpecsTabs({ tractor, tabMeaningNotes }: TractorSpecsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('engine');
  const meaningNote = tabMeaningNotes?.[activeTab];

  const renderSpecRow = (label: string, value: string | number | undefined, unit?: string) => {
    if (value === undefined || value === null || value === '') return null;
    return (
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 py-3 border-b border-gray-100 last:border-b-0">
        <dt className="text-gray-700 font-medium text-sm">{label}</dt>
        <dd className="font-semibold text-gray-900 text-left sm:text-right">
          {typeof value === 'number' ? value.toLocaleString() : value} {unit || ''}
        </dd>
      </div>
    );
  };

  const renderSectionHeader = (title: string, icon: React.ReactNode) => {
    return (
      <div className="bg-green-50 border-b border-green-100 px-4 md:px-6 py-3 -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-4 flex items-center gap-2">
        {icon}
        <h3 className="text-base md:text-lg font-bold text-gray-900">{title}</h3>
      </div>
    );
  };

  const renderEngineSpecs = () => {
    const { engine } = tractor;
    const hasData = engine.cylinders > 0 || engine.powerHP > 0;
    
    if (!hasData) {
      return <p className="text-gray-500 py-4">No engine data available.</p>;
    }

    return (
      <div>
        {renderSectionHeader('Engine', <Settings className="w-5 h-5 text-green-700" />)}
        <dl className="space-y-0">
          {renderSpecRow('Manufacturer', engine.manufacturer)}
          {renderSpecRow('Model', engine.model)}
          {engine.cylinders > 0 && renderSpecRow('Cylinders', engine.cylinders)}
          {engine.displacement && renderSpecRow('Displacement', `${engine.displacement} L (${(engine.displacement * 61.024).toFixed(1)} ci)`, '')}
          {engine.bore && engine.stroke && renderSpecRow('Bore × Stroke', `${engine.bore} mm (${(engine.bore / 25.4).toFixed(2)} in) × ${engine.stroke} mm (${(engine.stroke / 25.4).toFixed(2)} in)`, '')}
          {engine.powerHP && renderSpecRow('Maximum Power (Gross)', `${engine.powerHP} HP (${engine.powerKW || Math.round(engine.powerHP * 0.746)} kW)`, '')}
          {engine.powerHPNet && renderSpecRow('Net Power', `${engine.powerHPNet} HP (${Math.round(engine.powerHPNet * 0.746)} kW)`, '')}
          {engine.powerHPNominal && engine.powerRPM && renderSpecRow('Nominal Power', `${engine.powerHPNominal} HP @ ${engine.powerRPM} rpm`, '')}
          {engine.torqueMax && engine.torqueRPM && renderSpecRow('Maximum Torque', `${engine.torqueMax} Nm (${Math.round(engine.torqueMax * 0.737562)} lb-ft) @ ${engine.torqueRPM} rpm`, '')}
          {engine.torqueReserve && renderSpecRow('Torque Reserve', `${engine.torqueReserve}%`, '')}
          {engine.compression && renderSpecRow('Compression Ratio', `${engine.compression}:1`, '')}
          {engine.fuelSystem && renderSpecRow('Fuel System', engine.fuelSystem)}
          {engine.aspiration && renderSpecRow('Aspiration', engine.aspiration)}
          {engine.emissions && renderSpecRow('Emissions Standard', engine.emissions)}
          {engine.starterVolts && renderSpecRow('Starter Voltage', `${engine.starterVolts}V`, '')}
          {renderSpecRow('Fuel Type', engine.fuelType.charAt(0).toUpperCase() + engine.fuelType.slice(1))}
          {renderSpecRow('Cooling', engine.cooling.charAt(0).toUpperCase() + engine.cooling.slice(1))}
        </dl>
      </div>
    );
  };

  const renderTransmissionSpecs = () => {
    const { transmission } = tractor;
    const hasData = transmission.type || transmission.gears || transmission.description;
    
    if (!hasData) {
      return <p className="text-gray-500 py-4">No transmission data available.</p>;
    }

    return (
      <div>
        {renderSectionHeader('Transmission', <Gauge className="w-5 h-5 text-green-700" />)}
        <dl className="space-y-0">
          {transmission.type && renderSpecRow('Type', transmission.type.charAt(0).toUpperCase() + transmission.type.slice(1).replace(/([A-Z])/g, ' $1'))}
          {transmission.gears && renderSpecRow('Gears', transmission.description || `${transmission.gears}-speed`)}
          {transmission.description && !transmission.gears && renderSpecRow('Description', transmission.description)}
          {transmission.speedRange && renderSpecRow('Speed Range', transmission.speedRange)}
          {transmission.reverser && renderSpecRow('Reverser', transmission.reverser)}
          {transmission.clutch && renderSpecRow('Clutch', transmission.clutch)}
          {transmission.superSlowSpeed && renderSpecRow('Super Slow Speed', transmission.superSlowSpeed)}
        </dl>
        {transmission.features && transmission.features.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Features</h4>
            <div className="flex flex-wrap gap-2">
              {transmission.features.map((feature, idx) => (
                <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-sm font-medium">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHydraulicsSpecs = () => {
    const { hydraulicSystem } = tractor;
    if (!hydraulicSystem) return <p className="text-gray-500 py-4">No hydraulic system data available.</p>;
    return (
      <div>
        {renderSectionHeader('Hydraulic System', <Droplets className="w-5 h-5 text-green-700" />)}
        <dl className="space-y-0">
          {hydraulicSystem.type && renderSpecRow('Type', hydraulicSystem.type)}
          {hydraulicSystem.pumpFlow && renderSpecRow('Pump Capacity', `${hydraulicSystem.pumpFlow} L/min`, '')}
          {hydraulicSystem.maxPressure && renderSpecRow('Maximum Pressure', `${hydraulicSystem.maxPressure} bar`, '')}
          {hydraulicSystem.rearValves && renderSpecRow('Rear Valves', hydraulicSystem.rearValvesMax ? `${hydraulicSystem.rearValves} standard, up to ${hydraulicSystem.rearValvesMax}` : `${hydraulicSystem.rearValves} standard`, '')}
          {hydraulicSystem.frontValves && renderSpecRow('Front Valves', `${hydraulicSystem.frontValves} optional`, '')}
          {hydraulicSystem.liftCapacity && renderSpecRow('Rear Lift Capacity', `${hydraulicSystem.liftCapacity.toLocaleString()} kg`, '')}
          {hydraulicSystem.frontLiftCapacity && renderSpecRow('Front Lift Capacity', `${hydraulicSystem.frontLiftCapacity.toLocaleString()} kg optional`, '')}
          {hydraulicSystem.category && renderSpecRow('Hitch', hydraulicSystem.category)}
        </dl>
      </div>
    );
  };

  const renderPTOSpecs = () => {
    const { ptoHP, ptoRPM, ptoRearType, ptoRearSpeeds, ptoFront, ptoFrontPower, ptoActuation } = tractor;
    if (!ptoHP && !ptoRPM && !ptoRearType) return <p className="text-gray-500 py-4">No PTO data available.</p>;
    return (
      <div>
        {renderSectionHeader('Power Take-Off (PTO)', <Zap className="w-5 h-5 text-green-700" />)}
        <dl className="space-y-0">
          {ptoRearType && renderSpecRow('Rear Type', ptoRearType)}
          {ptoRearSpeeds && renderSpecRow('Rear Speeds', ptoRearSpeeds)}
          {ptoHP && ptoRPM && renderSpecRow('Rear Power', `${ptoHP} HP (${Math.round(ptoHP * 0.746)} kW)`, '')}
          {ptoFront && renderSpecRow('Front PTO', ptoFront)}
          {ptoFrontPower && renderSpecRow('Front Power', `${ptoFrontPower} HP (${Math.round(ptoFrontPower * 0.746)} kW)`, '')}
          {ptoActuation && renderSpecRow('Actuation', ptoActuation)}
        </dl>
      </div>
    );
  };

  const renderDimensionsSpecs = () => {
    const { dimensions, weight } = tractor;
    if (!dimensions && !weight) return <p className="text-gray-500 py-4">No dimensions data available.</p>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          {renderSectionHeader('Dimensions', <Ruler className="w-5 h-5 text-green-700" />)}
          <dl className="space-y-0">
            {dimensions?.length && renderSpecRow('Length', `${dimensions.length.toLocaleString()} mm (${(dimensions.length / 25.4).toFixed(1)} in)`, '')}
            {dimensions?.width && renderSpecRow('Width', `${dimensions.width.toLocaleString()} mm (${(dimensions.width / 25.4).toFixed(1)} in)`, '')}
            {dimensions?.height && renderSpecRow('Height', `${dimensions.height.toLocaleString()} mm (${(dimensions.height / 25.4).toFixed(1)} in)`, '')}
            {dimensions?.wheelbase && renderSpecRow('Wheelbase', `${dimensions.wheelbase.toLocaleString()} mm (${(dimensions.wheelbase / 25.4).toFixed(1)} in)`, '')}
            {dimensions?.groundClearance && renderSpecRow('Ground Clearance', `${dimensions.groundClearance.toLocaleString()} mm (${(dimensions.groundClearance / 25.4).toFixed(1)} in)`, '')}
            {dimensions?.frontTread && (dimensions.frontTread.min || dimensions.frontTread.max) && renderSpecRow('Front Tread', dimensions.frontTread.min && dimensions.frontTread.max ? `${dimensions.frontTread.min.toLocaleString()} - ${dimensions.frontTread.max.toLocaleString()} mm` : dimensions.frontTread.min ? `${dimensions.frontTread.min.toLocaleString()} mm` : `${dimensions.frontTread.max?.toLocaleString()} mm`, '')}
            {dimensions?.rearTread && (dimensions.rearTread.min || dimensions.rearTread.max) && renderSpecRow('Rear Tread', dimensions.rearTread.min && dimensions.rearTread.max ? `${dimensions.rearTread.min.toLocaleString()} - ${dimensions.rearTread.max.toLocaleString()} mm` : dimensions.rearTread.min ? `${dimensions.rearTread.min.toLocaleString()} mm` : `${dimensions.rearTread.max?.toLocaleString()} mm`, '')}
            {dimensions && (dimensions.length || dimensions.width) && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                {renderSpecRow('Turning Radius', 'N/A', '')}
              </div>
            )}
          </dl>
        </div>
        {weight && (
          <div>
            {renderSectionHeader('Weight', <Container className="w-5 h-5 text-gray-700" />)}
            <dl className="space-y-0">
              {renderSpecRow('Unladen Weight', `${weight.toLocaleString()} kg`, '')}
              {renderSpecRow('Maximum Permissible Weight', 'N/A', '')}
            </dl>
          </div>
        )}
      </div>
    );
  };

  const renderCapacitiesSpecs = () => {
    const { capacities } = tractor;
    if (!capacities) return <p className="text-gray-500 py-4">No capacities data available.</p>;
    return (
      <div>
        {renderSectionHeader('Capacities', <Container className="w-5 h-5 text-green-700" />)}
        <dl className="space-y-0">
          {capacities.fuelTank && renderSpecRow('Fuel Tank', `${capacities.fuelTank} L (${(capacities.fuelTank * 0.264172).toFixed(1)} gal)`, '')}
          {capacities.hydraulicReservoir && renderSpecRow('Hydraulic Oil', `${capacities.hydraulicReservoir} L (${(capacities.hydraulicReservoir * 0.264172).toFixed(1)} gal)`, '')}
          {capacities.coolant && renderSpecRow('Cooling System', `${capacities.coolant} L (${(capacities.coolant * 1.05669).toFixed(1)} qts)`, '')}
          {capacities.engineOil && renderSpecRow('Engine Oil', `${capacities.engineOil} L (${(capacities.engineOil * 1.05669).toFixed(1)} qts)`, '')}
          {capacities.transmissionOil && renderSpecRow('Transmission Oil', `${capacities.transmissionOil} L (${(capacities.transmissionOil * 1.05669).toFixed(1)} qts)`, '')}
        </dl>
      </div>
    );
  };

  const renderTiresSpecs = () => {
    const { tires } = tractor;
    if (!tires || (!tires.front && !tires.rear)) return <p className="text-gray-500 py-4">No tire data available.</p>;
    return (
      <div>
        {renderSectionHeader('Tires', <Container className="w-5 h-5 text-green-700" />)}
        <dl className="space-y-0">
          {tires.front && tires.front.length > 0 && (
            <div className="py-3 border-b border-gray-100">
              <dt className="text-gray-700 font-medium text-sm mb-2">Front Tires</dt>
              <dd className="flex flex-wrap gap-2">
                {tires.front.map((tire, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-900 rounded-full text-sm font-medium">
                    {tire}
                  </span>
                ))}
              </dd>
            </div>
          )}
          {tires.rear && tires.rear.length > 0 && (
            <div className="py-3 border-b border-gray-100 last:border-b-0">
              <dt className="text-gray-700 font-medium text-sm mb-2">Rear Tires</dt>
              <dd className="flex flex-wrap gap-2">
                {tires.rear.map((tire, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-50 text-green-900 rounded-full text-sm font-medium">
                    {tire}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
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
      case 'tires':
        return renderTiresSpecs();
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
        <div className="px-4 md:px-6 pt-4 pb-3">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-medium transition-all whitespace-nowrap
                    ${isActive
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }
                  `}
                >
                  <span className={isActive ? 'text-white' : 'text-gray-600'} style={{ display: 'flex', alignItems: 'center' }}>
                    {tab.icon}
                  </span>
                  <span className="text-xs md:text-sm lg:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 md:p-6">
        {meaningNote && (
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mb-4 border border-gray-100" role="note">
            <strong className="text-gray-700">What this means:</strong> {meaningNote}
          </p>
        )}
        {renderTabContent()}

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
