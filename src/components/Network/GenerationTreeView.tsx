/* eslint-disable */
import React from 'react';
import Tree from 'react-d3-tree';
import PureSvgNodeElementG from './PureSvgNodeElementG';

interface NetworkNode {
  name: string;
  data: {
    id: string;
    crnNo?: string;
    first_name?: string;
    sponserer_username?: string;
    isGolden?: boolean;
    isActive?: boolean;
    joiningDate?: string;
  };
  children?: NetworkNode[];
}

// ✅ Count all children recursively
const countTeam = (node: NetworkNode): number => {
  if (!node.children || node.children.length === 0) return 0;

  return node.children.reduce(
    (total, child) => total + 1 + countTeam(child),
    0
  );
};

// ✅ Transform with EXTRA DATA
const transformToD3 = (
  node: NetworkNode,
  parentName: string = ''
): any => ({
  name: node.data?.first_name || node.name || 'N/A',
  attributes: {
    ID: node.data?.crnNo || node.data?.id || '',
    Name: node.data?.first_name || node.name || '',
    JoiningDate: node.data?.joiningDate || 'N/A',
    SponsorName: parentName || 'N/A',
    TeamCount: countTeam(node),
    Status: node.data?.isActive ? 'Active' : 'Inactive',

    // KEEP THESE (IMPORTANT FOR COLORS)
    IsActive: node.data?.isActive,
    IsGolden: node.data?.isGolden,
  },
  children: (node.children ?? []).map((child) =>
    transformToD3(child, node.data?.first_name || node.name)
  ),
});

const GenerationTreeView: React.FC<{ network?: NetworkNode }> = ({
  network,
}) => {
  const treeData = transformToD3(network as NetworkNode);

  const smallScreen = window.innerWidth <= 768;

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{
          x: smallScreen ? 187 : 548,
          y: smallScreen ? 140 : 115,
        }}
        nodeSize={{ x: 220, y: 180 }}
        separation={{ siblings: 2, nonSiblings: 2 }}
        renderCustomNodeElement={(rd3tProps) => (
          <PureSvgNodeElementG
            nodeDatum={rd3tProps.nodeDatum}
            toggleNode={rd3tProps.toggleNode}
            orientation="vertical"
          />
        )}
      />
    </div>
  );
};

export default GenerationTreeView;