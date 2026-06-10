/* eslint-disable */
// @ts-nocheck

import React, {useState, useEffect} from 'react';
import Tree from 'react-d3-tree';
import MixedNodeInputElement from './MixedNodeInputElement';
import MixedNodeElement from './MixedNodeElement';
import PureSvgNodeElement from './PureSvgNodeElement';

const BinaryTreeNode = ({network}: {network: any}) => {
  const [data, setData] = useState<any>(null);
  const [hoveredNode, setHoveredNode] = useState<any>(null);

  const getRootNode = (source: any) => {
    if (!source) return null;

    if (source?.data?.data && Array.isArray(source?.data?.children)) {
      return source.data;
    }

    return source;
  };

  // ✅ NEW: count only real nodes (ignore invisible ones)
  const countRealNodes = (node: any): number => {
    if (!node || node._invisible) return 0;

    let count = 0;

    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => {
        count += countRealNodes(child);
      });
    }

    return 1 + count;
  };

  const transformNode = (node: any) => {
    if (!node || !node.data) return null;

    const {
      side = '',
      id = '',
      first_name = '',
      directSponsorId = '',
      isGolden = false,
      isActive = false,
      leftCount = 0,
      rightCount = 0,
      orderStatus = '',
    } = node.data;

    let children: any[] = [];

    const normalizedChildren = Array.isArray(node.children) ? node.children : [];

    const leftChildBySide = normalizedChildren.find(
      (child: any) => child?.data?.side === 'LEFT',
    );

    const rightChildBySide = normalizedChildren.find(
      (child: any) => child?.data?.side === 'RIGHT',
    );

    const leftChild = leftChildBySide || normalizedChildren[0];

    const rightChild =
      rightChildBySide ||
      normalizedChildren.find((child: any) => child !== leftChild) ||
      null;

    children.push(
      leftChild
        ? transformNode(leftChild)
        : {
            name: ' ',
            attributes: {},
            _invisible: true,
            __side: 'LEFT',
            __parentId: id,
            children: [],
          },
    );

    children.push(
      rightChild
        ? transformNode(rightChild)
        : {
            name: ' ',
            attributes: {},
            _invisible: true,
            __side: 'RIGHT',
            __parentId: id,
            children: [],
          },
    );

    // ✅ FIX: calculate real team count
    const realChildren = children.filter((child) => !child?._invisible);

    const teamCount = realChildren.reduce(
      (acc, child) => acc + countRealNodes(child),
      0
    );

    return {
      name: first_name,
      attributes: {
        ID: id,
        FirstName: first_name,
       DirectSponsorId: directSponsorId || null,
        Side: side,
        IsGolden: isGolden,
        IsActive: isActive,
        LeftCount: leftCount,
        RightCount: rightCount,
        OrderStatus: orderStatus,

        // ✅ THIS WAS MISSING
        TeamCount: teamCount,
      },
      ...(children.length > 0 ? {children} : {}),
    };
  };

  useEffect(() => {
    const transformedData = transformNode(getRootNode(network));
    setData(transformedData);
  }, [network]);

  const windowWidth = window.innerWidth;
  const smallScreen = windowWidth <= 768;

  const countNodes = (node: any): number => {
    if (!node?.children || node?.children?.length === 0) {
      return 0;
    }

    let count = node?.children?.length;

    node.children.forEach((child: any) => {
      count += countNodes(child);
    });

    return count;
  };

  const customNodeFnMapping: any = {
    svg: {
      fn: (rd3tProps: any, appState: any) => (
        <PureSvgNodeElement
          nodeDatum={rd3tProps.nodeDatum}
          toggleNode={rd3tProps.toggleNode}
          orientation={appState.orientation}
          matchedNode={undefined}
          fullTreeData={data}
        />
      ),
    },
    mixed: {
      fn: ({nodeDatum, toggleNode}: any, appState: any) => (
        <MixedNodeElement
          nodeData={nodeDatum}
          triggerNodeToggle={toggleNode}
          foreignObjectProps={{
            width: appState.nodeSize.x,
            height: appState.nodeSize.y,
            x: -50,
            y: 50,
          }}
        />
      ),
    },
    input: {
      fn: ({nodeDatum, toggleNode}: any, appState: any) => (
        <MixedNodeInputElement
          nodeData={nodeDatum}
          triggerNodeToggle={toggleNode}
          foreignObjectProps={{
            width: appState.nodeSize.x,
            height: appState.nodeSize.y,
            x: -50,
            y: 50,
          }}
        />
      ),
    },
  };

  const treeProps = {
    data: data,
    totalNodeCount: data && Object.keys(data).length > 0 && countNodes(data),
    orientation: 'vertical',
    centeringTransitionDuration: 800,
    translateX: smallScreen ? 187 : 548,
    translateY: smallScreen ? 140 : 115,
    collapsible: true,
    shouldCollapseNeighborNodes: false,
    initialDepth: 6,
    zoomable: true,
    draggable: true,
    zoom: 1,
    scaleExtent: {min: 0.1, max: 1},
    separation: {siblings: 2, nonSiblings: 2},
    nodeSize: {x: 200, y: 200},
    enableLegacyTransitions: false,
    transitionDuration: 500,
    renderCustomNodeElement: customNodeFnMapping['svg'].fn,  // Keep SVG but the plus will be hidden in PureSvgNodeElement
  };

  if (!data) return <div>Loading...</div>;

  const containerStyles: React.CSSProperties = {
    width: '100%',
    height: '100vh',
    position: 'relative',
  };

  return (
    Object.keys(getRootNode(network) || {}).length > 0 && (
      <div
        className={`relative ${smallScreen ? 'mobileTree' : 'desktopTree'}`}
        style={containerStyles}
      >
        <Tree
          data={treeProps.data as any}
          renderCustomNodeElement={(rd3tProps: any) =>
            treeProps.renderCustomNodeElement(rd3tProps, {...treeProps})
          }
          orientation={treeProps.orientation as any}
          centeringTransitionDuration={treeProps.centeringTransitionDuration}
          translate={{x: treeProps.translateX, y: treeProps.translateY}}
          collapsible={treeProps.collapsible}
          initialDepth={treeProps.initialDepth}
          zoomable={treeProps.zoomable}
          draggable={treeProps.draggable}
          zoom={treeProps.zoom}
          scaleExtent={treeProps.scaleExtent}
          nodeSize={treeProps.nodeSize}
          separation={treeProps.separation}
          enableLegacyTransitions={treeProps.enableLegacyTransitions}
          transitionDuration={treeProps.transitionDuration}
          shouldCollapseNeighborNodes={treeProps.shouldCollapseNeighborNodes}
          onNodeClick={(node: any) => {
            setHoveredNode(node);
          }}
        />
      </div>
    )
  );
};

export default BinaryTreeNode;