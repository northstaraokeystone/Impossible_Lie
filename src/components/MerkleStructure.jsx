/**
 * MerkleStructure - Three.js visualization of Merkle tree
 * Nodes as spheres, edges as lines
 */

import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Individual node component
function MerkleNode({ position, isLeaf, isTampered, isRoot }) {
  const meshRef = useRef()

  // Animate tampered nodes
  useFrame((state) => {
    if (isTampered && meshRef.current) {
      meshRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 5) * 0.1
      )
    }
  })

  const color = isTampered
    ? '#ef4444'
    : isRoot
    ? '#22c55e'
    : isLeaf
    ? '#3b82f6'
    : '#6b7280'

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[isRoot ? 0.22 : isLeaf ? 0.16 : 0.12, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={isTampered ? '#ef4444' : '#000000'}
        emissiveIntensity={isTampered ? 0.5 : 0}
      />
    </mesh>
  )
}

// Edge between nodes
function MerkleEdge({ start, end, isTampered }) {
  const points = useMemo(() => {
    return [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    ]
  }, [start, end])

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [points])

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color={isTampered ? '#ef4444' : '#4b5563'}
        linewidth={1}
        opacity={isTampered ? 1 : 0.6}
        transparent
      />
    </line>
  )
}

// Main tree visualization
function TreeVisualization({ tree, tamperedIndex, rejected }) {
  const nodes = useMemo(() => {
    if (!tree || !tree.nodes || tree.nodes.length === 0) {
      return { nodePositions: [], edges: [], maxLevel: 0 }
    }

    // Group nodes by level
    const levels = []
    let maxLevel = 0

    tree.nodes.forEach((node) => {
      maxLevel = Math.max(maxLevel, node.level)
      if (!levels[node.level]) {
        levels[node.level] = []
      }
      levels[node.level].push(node)
    })

    // Calculate positions
    const nodePositions = []
    const positionMap = new Map()
    const levelSpacing = 1.5
    const horizontalSpacing = 1.2

    levels.forEach((levelNodes, level) => {
      const y = (maxLevel - level) * levelSpacing - (maxLevel * levelSpacing) / 2
      const totalWidth = (levelNodes.length - 1) * horizontalSpacing

      levelNodes.forEach((node, i) => {
        const x = i * horizontalSpacing - totalWidth / 2
        const position = [x, y, 0]
        positionMap.set(`${node.level}-${node.index}`, position)
        nodePositions.push({
          position,
          node,
          isLeaf: node.isLeaf,
          isTampered: rejected && node.isLeaf && node.index === tamperedIndex,
          isRoot: level === maxLevel
        })
      })
    })

    // Calculate edges
    const edges = []
    tree.nodes.forEach((node) => {
      if (node.leftChild) {
        const startPos = positionMap.get(`${node.level}-${node.index}`)
        const endPos = positionMap.get(`${node.leftChild.level}-${node.leftChild.index}`)
        if (startPos && endPos) {
          edges.push({
            start: startPos,
            end: endPos,
            isTampered: rejected && node.leftChild.isLeaf && node.leftChild.index === tamperedIndex
          })
        }
      }
      if (node.rightChild && node.rightChild !== node.leftChild) {
        const startPos = positionMap.get(`${node.level}-${node.index}`)
        const endPos = positionMap.get(`${node.rightChild.level}-${node.rightChild.index}`)
        if (startPos && endPos) {
          edges.push({
            start: startPos,
            end: endPos,
            isTampered: rejected && node.rightChild.isLeaf && node.rightChild.index === tamperedIndex
          })
        }
      }
    })

    return { nodePositions, edges, maxLevel }
  }, [tree, tamperedIndex, rejected])

  return (
    <>
      {/* Nodes */}
      {nodes.nodePositions.map((n, i) => (
        <MerkleNode
          key={`node-${i}`}
          position={n.position}
          isLeaf={n.isLeaf}
          isTampered={n.isTampered}
          isRoot={n.isRoot}
        />
      ))}

      {/* Edges */}
      {nodes.edges.map((edge, i) => (
        <MerkleEdge
          key={`edge-${i}`}
          start={edge.start}
          end={edge.end}
          isTampered={edge.isTampered}
        />
      ))}
    </>
  )
}

export default function MerkleStructure({ tree, tamperedIndex = null, rejected = false }) {
  return (
    <div className="w-full h-[400px] bg-gray-900/30 rounded-lg border border-gray-800 relative p-6">
      {/* Canvas container with inner padding to prevent cutoff */}
      <div className="w-full h-full rounded overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <TreeVisualization
            tree={tree}
            tamperedIndex={tamperedIndex}
            rejected={rejected}
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </div>

      {/* Legend - positioned inside container at bottom with better spacing */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 text-sm font-mono text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Leaf</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span>Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Root</span>
        </div>
        {rejected && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Tampered</span>
          </div>
        )}
      </div>
    </div>
  )
}
