import { useEffect, useRef, useState } from 'react';
import CameraThumbnail from './CameraThumbnail';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';
import { useRigFilter } from '../store/rigFilterStore';

interface Camera {
  id: number;
  name: string;
  image: string;
  video?: string;
  isAlert: boolean;
  hasDetection: boolean;
}

const cameras: Camera[] = [
  { id: 1, name: 'Camera 01', image: '/assets/images/camera-01.png', isAlert: false, hasDetection: false },
  { id: 2, name: 'Camera 02', image: '/assets/images/camera-02.png', isAlert: false, hasDetection: false },
  { id: 3, name: 'Camera 03', image: '/assets/images/camera-03.png', isAlert: false, hasDetection: false },
  { id: 4, name: 'Camera 04', image: '/assets/images/camera-04.png', video: '/assets/images/Rig video 1.mp4', isAlert: true, hasDetection: true },
  { id: 5, name: 'Camera 05', image: '/assets/images/camera-05.png', isAlert: false, hasDetection: false },
  { id: 6, name: 'Camera 06', image: '/assets/images/camera-06.png', isAlert: false, hasDetection: false },
];

interface RigNode {
  id: string;
  name: string;
}

interface SiteNode {
  id: string;
  name: string;
  rigs: RigNode[];
}

interface RegionNode {
  id: string;
  name: string;
  sites: SiteNode[];
}

const THUMBNAIL_HIERARCHY_DATA: RegionNode[] = [
  {
    id: 'east',
    name: 'East',
    sites: [
      {
        id: 'site-1',
        name: 'Site 1',
        rigs: [
          { id: 'rig-145', name: 'Rig 145' },
          { id: 'rig-146', name: 'Rig 146' },
        ],
      },
      {
        id: 'site-2',
        name: 'Site 2',
        rigs: [{ id: 'rig-147', name: 'Rig 147' }],
      },
      {
        id: 'site-3',
        name: 'Site 3',
        rigs: [{ id: 'rig-148', name: 'Rig 148' }],
      },
      {
        id: 'site-4',
        name: 'Site 4',
        rigs: [
          { id: 'rig-149', name: 'Rig 149' },
          { id: 'rig-150', name: 'Rig 150' },
        ],
      },
    ],
  },
  {
    id: 'west',
    name: 'West',
    sites: [
      {
        id: 'site-5',
        name: 'Site 5',
        rigs: [
          { id: 'rig-151', name: 'Rig 151' },
          { id: 'rig-152', name: 'Rig 152' },
        ],
      },
      {
        id: 'site-6',
        name: 'Site 6',
        rigs: [{ id: 'rig-153', name: 'Rig 153' }],
      },
      {
        id: 'site-7',
        name: 'Site 7',
        rigs: [{ id: 'rig-154', name: 'Rig 154' }],
      },
      {
        id: 'site-8',
        name: 'Site 8',
        rigs: [{ id: 'rig-155', name: 'Rig 155' }],
      },
    ],
  },
  {
    id: 'north',
    name: 'North',
    sites: [
      {
        id: 'site-9',
        name: 'Site 9',
        rigs: [{ id: 'rig-156', name: 'Rig 156' }],
      },
      {
        id: 'site-10',
        name: 'Site 10',
        rigs: [
          { id: 'rig-157', name: 'Rig 157' },
          { id: 'rig-158', name: 'Rig 158' },
        ],
      },
      {
        id: 'site-11',
        name: 'Site 11',
        rigs: [{ id: 'rig-159', name: 'Rig 159' }],
      },
      {
        id: 'site-12',
        name: 'Site 12',
        rigs: [{ id: 'rig-160', name: 'Rig 160' }],
      },
    ],
  },
  {
    id: 'south',
    name: 'South',
    sites: [
      {
        id: 'site-13',
        name: 'Site 13',
        rigs: [{ id: 'rig-161', name: 'Rig 161' }],
      },
      {
        id: 'site-14',
        name: 'Site 14',
        rigs: [{ id: 'rig-162', name: 'Rig 162' }],
      },
      {
        id: 'site-15',
        name: 'Site 15',
        rigs: [
          { id: 'rig-163', name: 'Rig 163' },
          { id: 'rig-164', name: 'Rig 164' },
        ],
      },
      {
        id: 'site-16',
        name: 'Site 16',
        rigs: [{ id: 'rig-165', name: 'Rig 165' }],
      },
    ],
  },
];

interface CameraThumbnailBarProps {
  onChipClick?: () => void;
}

function CameraThumbnailBar({ onChipClick }: CameraThumbnailBarProps) {
  const { isInScope, selectedCount, buildScopeText } = useRigFilter();
  const [activeCamera, setActiveCamera] = useState<number>(1);
  const [isHierarchyOpen, setIsHierarchyOpen] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('east');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('site-1');
  const [selectedRigId, setSelectedRigId] = useState<string>('rig-145');
  const hierarchyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hierarchyRef.current && !hierarchyRef.current.contains(event.target as Node)) {
        setIsHierarchyOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRegion = THUMBNAIL_HIERARCHY_DATA.find((region) => region.id === selectedRegionId);
  const currentSite = currentRegion?.sites.find((site) => site.id === selectedSiteId);
  const currentRig = currentSite?.rigs.find((rig) => rig.id === selectedRigId);

  const handleRegionHover = (regionId: string) => {
    const nextRegion = THUMBNAIL_HIERARCHY_DATA.find((region) => region.id === regionId);
    const firstSite = nextRegion?.sites[0];
    const firstRig = firstSite?.rigs[0];

    setSelectedRegionId(regionId);
    setSelectedSiteId(firstSite?.id ?? '');
    setSelectedRigId(firstRig?.id ?? '');
  };

  const handleSiteHover = (siteId: string) => {
    const nextSite = currentRegion?.sites.find((site) => site.id === siteId);
    setSelectedSiteId(siteId);
    setSelectedRigId(nextSite?.rigs[0]?.id ?? '');
  };

  const handleRigSelect = (rigId: string) => {
    setSelectedRigId(rigId);
    setIsHierarchyOpen(false);
  };

  return (
    <section className="thumbnail-section" aria-label="Camera thumbnails">
      <div className="thumbnail-section__top">
        <div className="hierarchy-dropdown" ref={hierarchyRef}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="thumbnail-section__dropdown"
                type="button"
                aria-label="Select rig hierarchy"
                aria-haspopup="true"
                aria-expanded={isHierarchyOpen}
                onClick={() => setIsHierarchyOpen((previous) => !previous)}
              >
                <span>{currentRig?.name ?? 'Select rig'}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Select a rig to show its camera thumbnails</TooltipContent>
          </Tooltip>

          {isHierarchyOpen && (
            <div className="hierarchy-dropdown__menu">
              <div className="hierarchy-dropdown__column">
                {THUMBNAIL_HIERARCHY_DATA.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    className={`hierarchy-dropdown__item ${selectedRegionId === region.id ? 'hierarchy-dropdown__item--selected' : ''}`}
                    onMouseEnter={() => handleRegionHover(region.id)}
                  >
                    <span>{region.name}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ))}
              </div>

              <div className="hierarchy-dropdown__column">
                {(currentRegion?.sites ?? []).length > 0 ? (
                  currentRegion?.sites.map((site) => (
                    <button
                      key={site.id}
                      type="button"
                      className={`hierarchy-dropdown__item ${selectedSiteId === site.id ? 'hierarchy-dropdown__item--selected' : ''}`}
                      onMouseEnter={() => handleSiteHover(site.id)}
                    >
                      <span>{site.name}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  ))
                ) : (
                  <div className="hierarchy-dropdown__empty">No sites</div>
                )}
              </div>

              <div className="hierarchy-dropdown__column">
                {(currentSite?.rigs ?? []).length > 0 ? (
                  currentSite?.rigs.map((rig) => (
                    <button
                      key={rig.id}
                      type="button"
                      className={`hierarchy-dropdown__item ${selectedRigId === rig.id ? 'hierarchy-dropdown__item--selected' : ''}`}
                      onClick={() => handleRigSelect(rig.id)}
                    >
                      <span>{rig.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="hierarchy-dropdown__empty">No rigs</div>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedCount > 0 && (() => {
          const full = buildScopeText();
          const chipText = full.startsWith('My Rigs: ') ? full.slice('My Rigs: '.length) : full;
          return (
            <div className="scope-chip" role="button" tabIndex={0} aria-label={`Active rig filter: ${chipText}`} onClick={onChipClick} onKeyDown={e => e.key === 'Enter' && onChipClick?.()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>{chipText}</span>
            </div>
          );
        })()}
      </div>

      {selectedCount > 0 && !isInScope(selectedRigId) && (
        <div className="thumbnail-bar__filter-notice">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Selected rig is outside the My Rigs filter</span>
        </div>
      )}

      <div className="thumbnail-bar" role="listbox" aria-label="Camera feed thumbnails">
        {cameras.map((camera) => (
          <CameraThumbnail
            key={camera.id}
            name={camera.name}
            image={camera.image}
            video={camera.video}
            isActive={activeCamera === camera.id}
            isAlert={camera.isAlert}
            hasDetection={camera.hasDetection}
            onClick={() => setActiveCamera(camera.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default CameraThumbnailBar;
