/* eslint-disable */
import React, { useState } from 'react';
import Tree from 'react-d3-tree';
import PureSvgNodeElementG from './PureSvgNodeElementG';

// ─── Mock data (replace with real API response) ───────────────────────────────
const MOCK_GENERATION_DATA = {
  name: 'You (Root)',
  data: { id: 'ROOT001', crnNo: 'CRN001', first_name: 'You', sponserer_username: '-', isGolden: false, isActive: true },
  children: [
    {
      name: 'Member A',
      data: { id: 'MEM001', crnNo: 'CRN002', first_name: 'Member A', sponserer_username: 'CRN001', isGolden: false, isActive: true },
      children: [],
    },
    {
      name: 'Member B',
      data: { id: 'MEM002', crnNo: 'CRN003', first_name: 'Member B', sponserer_username: 'CRN001', isGolden: true, isActive: true },
      children: [],
    },
    {
      name: 'Member C',
      data: { id: 'MEM003', crnNo: 'CRN004', first_name: 'Member C', sponserer_username: 'CRN001', isGolden: false, isActive: false },
      children: [],
    },
    {
      name: 'Member D',
      data: { id: 'MEM004', crnNo: 'CRN005', first_name: 'Member D', sponserer_username: 'CRN001', isGolden: false, isActive: true },
      children: [],
    },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

interface NetworkNode {
  name: string;
  data: {
    id: string;
    crnNo?: string;
    first_name?: string;
    sponserer_username?: string;
    isGolden?: boolean;
    isActive?: boolean;
  };
  children?: NetworkNode[];
}

interface Props {
  network?: NetworkNode;
}

const transformToD3 = (node: NetworkNode): any => ({
  name: node.name,
  attributes: {
    ID: node.data?.id,
    CRN: node.data?.crnNo || '',
    Sponsor: node.data?.sponserer_username || '',
    Active: node.data?.isActive ? 'Yes' : 'No',
  },
  // Only render ONE level of children — no recursion
  children: (node.children ?? []).map((child) => ({
    name: child.name,
    attributes: {
      ID: child.data?.id,
      CRN: child.data?.crnNo || '',
      Sponsor: child.data?.sponserer_username || '',
      Active: child.data?.isActive ? 'Yes' : 'No',
    },
    children: [], // Stop here — single level only
  })),
});

const GenerationTreeView: React.FC<Props> = ({ network }) => {
  const source = network && Object.keys(network).length > 0 ? network : MOCK_GENERATION_DATA;
  const treeData = transformToD3(source as NetworkNode);

  const windowWidth = window.innerWidth;
  const smallScreen = windowWidth <= 768;

  const containerStyles: React.CSSProperties = {
    width: '100%',
    height: '100vh',
    position: 'relative',
  };

  return (
    <div
      className={`relative ${smallScreen ? 'mobileTree' : 'desktopTree'}`}
      style={containerStyles}
    >
      <div className="flex items-center gap-3 p-4">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Direct children shown: {source.children?.length ?? 0}
        </span>
        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
          Mock Data — Replace with API
        </span>
      </div>
      <Tree
        data={treeData}
        orientation="vertical"
        centeringTransitionDuration={800}
        translate={{ x: smallScreen ? 187 : 548, y: smallScreen ? 140 : 115 }}
        collapsible={false}
        initialDepth={2}
        zoomable={true}
        draggable={true}
        zoom={1}
        scaleExtent={{ min: 0.1, max: 2 }}
        nodeSize={{ x: 220, y: 180 }}
        separation={{ siblings: 2, nonSiblings: 2 }}
        enableLegacyTransitions={false}
        transitionDuration={500}
        renderCustomNodeElement={(rd3tProps) => (
          <PureSvgNodeElementG
            nodeDatum={rd3tProps.nodeDatum}
            toggleNode={rd3tProps.toggleNode}
            orientation="vertical"
          />
        )}
        styles={{
          links: { stroke: '#9CA3AF', strokeWidth: 2 },
          nodes: {
            node: {
              circle: { fill: 'transparent', stroke: '#000', strokeWidth: 2 },
              attributes: { fill: '#000', fontSize: 14 },
              name: { fill: '#000', fontWeight: 'bold' },
            },
            leafNode: {
              circle: { fill: 'transparent', stroke: '#000', strokeWidth: 2 },
              attributes: { fill: '#000', fontSize: 14 },
              name: { fill: '#000', fontWeight: 'bold' },
            },
          },
        }}
      />
    </div>
  );
};

export default GenerationTreeView;
