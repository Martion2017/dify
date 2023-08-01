import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ModelSelector from './model-selector'
import ModelCard from './model-card'
import ModelItem from './model-item'
import ModelModal from './model-modal'
import { ChevronDownDouble } from '@/app/components/base/icons/src/vender/line/arrows'

const MODEL_LIST = [
  {
    key: 'azure_openai',
    type: 'add',
  },
  {
    key: 'replicate',
    type: 'add',
  },
  {
    key: 'huggingface_hub',
    type: 'add',
  },
  {
    key: 'tongyi',
    type: 'setup',
  },
  {
    key: 'minimax',
    type: 'setup',
  },
  {
    key: 'chatglm',
    type: 'setup',
  },
]

const ModelPage = () => {
  const { t } = useTranslation()
  const [showMoreModel, setShowMoreModel] = useState(false)
  const [modelModalShow, setModelModalShow] = useState(false)

  return (
    <div className='pt-1'>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div className='w-full'>
          <div className='py-2 text-sm font-medium text-gray-900'>
            {t('common.modelProvider.systemReasoningModel.key')}
          </div>
          <div>
            <ModelSelector />
          </div>
        </div>
      </div>
      <div className='mb-4 h-[0.5px] bg-gray-100' />
      <div className='mb-3 text-sm font-medium text-gray-800'>{t('common.modelProvider.models')}</div>
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <ModelCard />
        <ModelCard type='anthropic' />
      </div>
      {
        MODEL_LIST.slice(0, showMoreModel ? MODEL_LIST.length : 3).map(model => (
          <ModelItem
            key={model.key}
            provider={model.key}
            type={model.type}
            onOperate={() => setModelModalShow(true)}
          />
        ))
      }
      {
        !showMoreModel && (
          <div className='inline-flex items-center px-1 h-[26px] cursor-pointer' onClick={() => setShowMoreModel(true)}>
            <ChevronDownDouble className='mr-1 w-3 h-3 text-gray-500' />
            <div className='text-xs font-medium text-gray-500'>{t('common.modelProvider.showMoreModelProvider')}</div>
          </div>
        )
      }
      <ModelModal
        isShow={modelModalShow}
        onCancel={() => setModelModalShow(false)}
      />
    </div>
  )
}

export default ModelPage
