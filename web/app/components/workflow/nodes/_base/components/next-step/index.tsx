import { memo } from 'react'
import {
  getConnectedEdges,
  getOutgoers,
  useEdges,
  useStoreApi,
} from 'reactflow'
import BlockIcon from '../../../../block-icon'
import type {
  Branch,
  Node,
} from '../../../../types'
import { BlockEnum } from '../../../../types'
import Add from './add'
import Item from './item'
import Line from './line'

type NextStepProps = {
  selectedNode: Node
}
const NextStep = ({
  selectedNode,
}: NextStepProps) => {
  const store = useStoreApi()
  const branches = selectedNode.data._targetBranches || []
  const nodeWithBranches = selectedNode.data.type === BlockEnum.IfElse || selectedNode.data.type === BlockEnum.QuestionClassifier
  const edges = useEdges()
  const outgoers = getOutgoers(selectedNode as Node, store.getState().getNodes(), edges)
  const connectedEdges = getConnectedEdges([selectedNode] as Node[], edges).filter(edge => edge.source === selectedNode!.id)

  return (
    <div className='flex py-1'>
      <div className='shrink-0 relative flex items-center justify-center w-9 h-9 bg-white rounded-lg border-[0.5px] border-gray-200 shadow-xs'>
        <BlockIcon
          type={selectedNode!.data.type}
          toolProviderId={selectedNode!.data.provider_id}
        />
      </div>
      <Line linesNumber={nodeWithBranches ? branches.length : 1} />
      <div className='grow'>
        {
          !nodeWithBranches && !!outgoers.length && (
            <Item
              nodeId={outgoers[0].id}
              data={outgoers[0].data}
              sourceHandle='source'
            />
          )
        }
        {
          !nodeWithBranches && !outgoers.length && (
            <Add
              nodeId={selectedNode!.id}
              nodeType={selectedNode!.data.type}
              sourceHandle='source'
            />
          )
        }
        {
          !!branches?.length && nodeWithBranches && (
            branches.map((branch: Branch) => {
              const connected = connectedEdges.find(edge => edge.sourceHandle === branch.id)
              const target = outgoers.find(outgoer => outgoer.id === connected?.target)

              return (
                <div
                  key={branch.id}
                  className='mb-3 last-of-type:mb-0'
                >
                  {
                    connected && (
                      <Item
                        data={target!.data!}
                        nodeId={target!.id}
                        sourceHandle={branch.id}
                        branchName={branch.name}
                      />
                    )
                  }
                  {
                    !connected && (
                      <Add
                        key={branch.id}
                        nodeId={selectedNode!.id}
                        nodeType={selectedNode!.data.type}
                        sourceHandle={branch.id}
                        branchName={branch.name}
                      />
                    )
                  }
                </div>
              )
            })
          )
        }
      </div>
    </div>
  )
}

export default memo(NextStep)
