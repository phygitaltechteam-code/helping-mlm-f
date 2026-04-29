/* eslint-disable */
import React, { useState } from 'react';
import Tree from 'react-d3-tree';
import PureSvgNodeElementG from './PureSvgNodeElementG';
import { any } from 'zod';



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
    IsActive: node.data?.isActive,
    IsGolden: node.data?.isGolden,
  },
  children: (node.children ?? []).map((child) => transformToD3(child)),
});

const GenerationTreeView: React.FC<Props> = ({ network }) => {
  const source = network;
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
          Direct children shown: {source?.children?.length ?? 0}
        </span>
      </div>
      <Tree
        data={treeData}
        orientation="vertical"
        centeringTransitionDuration={800}
        translate={{ x: smallScreen ? 187 : 548, y: smallScreen ? 140 : 115 }}
        collapsible={true}
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
