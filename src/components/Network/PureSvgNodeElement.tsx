import React, { useState } from 'react';
import { user, userbw, golden, userRed } from '../../assets/images/user';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from '@tanstack/react-router';

const textLayout = {
  vertical: {
    title: { textAnchor: 'start', x: 40 },
    attribute: { x: 40, dy: '1.2em' },
  },
  horizontal: {
    title: { textAnchor: 'start', y: 40 },
    attribute: { x: 0, dy: '1.2em' },
  },
};

const PureSvgNodeElement = ({
  nodeDatum,
  orientation,
  toggleNode,
  matchedNode,
  fullTreeData,
}) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const attributes = nodeDatum.attributes || {};

  // ✅ Build ID → Name map
const buildIdNameMap = (node, map = {}) => {
  if (!node) return map;

  if (node.attributes?.ID) {
    map[node.attributes.ID] = node.attributes.FirstName || node.name;
  }

  if (node.children) {
    node.children.forEach((child) => buildIdNameMap(child, map));
  }

  return map;
};

const idNameMap = buildIdNameMap(fullTreeData);

// ✅ Resolve sponsor name safely
const sponsorId = attributes.DirectSponsorId;

const sponsorName =
  sponsorId && idNameMap[sponsorId]
    ? idNameMap[sponsorId]
    : sponsorId || 'N/A';

  // ✅ CLEAN CARD DATA ONLY
 const filteredAttributes = [
  {
    key: 'CRN',
    value: attributes.ID || 'N/A',
  },
  {
    key: 'Name',
    value: attributes.FirstName || nodeDatum.name || 'N/A',
  },
  {
    key: 'Sponsor',
    value: sponsorName, // ✅ FIXED
  },
  {
    key: 'TeamCount',
    value: attributes.TeamCount ?? 0,
  },
  {
    key: '__status',
    value: attributes.IsActive ? 'Active' : 'Inactive',
  },
];

  if (nodeDatum._invisible) {
    return (
      <>
        <circle r={1} fill="transparent" />
        <foreignObject x={-20} y={-20} width={50} height={50}>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f0f0f0',
              borderRadius: '50%',
              cursor: 'pointer',
              border: '1px dashed gray',
            }}
            // onClick={() =>
            //   navigate({
            //     to: '/admin/customerregister',
            //     state: {
            //       data: {
            //         side: nodeDatum.__side,
            //         parentId: nodeDatum.__parentId,
            //       },
            //     },
            //   })
            // }
          >
            {/* <FiPlus /> */}
          </div>
        </foreignObject>
      </>
    );
  }

  const imageSource = !attributes.IsActive
    ? userRed
    : attributes.IsGolden
      ? golden
      : nodeDatum.children?.length
        ? user
        : userbw;

  return (
    <>
      <g
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
        style={{ cursor: 'pointer' }}
      >
        <image
          href={imageSource}
          width={45}
          height={45}
          onClick={toggleNode}
          style={{
            outline:
              matchedNode?.attributes?.ID === attributes?.ID
                ? '10px solid red'
                : 'none',
            borderRadius: '50%',
          }}
          x={-20}
          y={-20}
        />

        <text
          className="rd3t-label__title"
          {...textLayout[orientation].title}
          style={{
            fill: attributes?.IsActive ? '' : 'red',
          }}
        >
          <tspan x={textLayout[orientation].title.x} dy="0">
            {nodeDatum.name}
          </tspan>
          <tspan x={textLayout[orientation].title.x} dy="1.2em">
            {attributes?.ID}
          </tspan>
        </text>

        {showPopup && (
          <foreignObject x={50} y={20} width={220} height={180}>
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                background: 'white',
                border: '1px solid gray',
                borderRadius: 8,
                padding: 10,
                fontSize: 12,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            >
              {filteredAttributes.map(({ key, value }) => {
                if (key === '__status') {
                  return (
                    <div key={key} style={{ fontWeight: 'bold' }}>
                      {value}
                    </div>
                  );
                }

                return (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                );
              })}
            </div>
          </foreignObject>
        )}
      </g>
    </>
  );
};

export default PureSvgNodeElement;