import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import MemoryConfig from '../_base/components/memory-config'
import VarReferencePicker from '../_base/components/variable/var-reference-picker'
import useConfig from './use-config'
import ResolutionPicker from './components/resolution-picker'
import type { LLMNodeType } from './types'
import ConfigPrompt from './components/config-prompt'
import VarList from '@/app/components/workflow/nodes/_base/components/variable/var-list'
import Field from '@/app/components/workflow/nodes/_base/components/field'
import AddButton from '@/app/components/base/button/add-button'
import Split from '@/app/components/workflow/nodes/_base/components/split'
import ModelParameterModal from '@/app/components/header/account-setting/model-provider-page/model-parameter-modal'
import OutputVars, { VarItem } from '@/app/components/workflow/nodes/_base/components/output-vars'
import { Resolution } from '@/types/app'
import { InputVarType, type NodePanelProps } from '@/app/components/workflow/types'
import BeforeRunForm from '@/app/components/workflow/nodes/_base/components/before-run-form'
import type { Props as FormProps } from '@/app/components/workflow/nodes/_base/components/before-run-form/form'
import ResultPanel from '@/app/components/workflow/run/result-panel'
import TooltipPlus from '@/app/components/base/tooltip-plus'
import { HelpCircle } from '@/app/components/base/icons/src/vender/line/general'
import Editor from '@/app/components/workflow/nodes/_base/components/prompt/editor'
import { QUERY_PLACEHOLDER_TEXT } from '@/app/components/base/prompt-editor/constants'
const i18nPrefix = 'workflow.nodes.llm'

const Panel: FC<NodePanelProps<LLMNodeType>> = ({
  id,
  data,
}) => {
  const { t } = useTranslation()

  const {
    readOnly,
    inputs,
    isChatModel,
    isChatMode,
    isCompletionModel,
    isShowVisionConfig,
    handleModelChanged,
    hasSetBlockStatus,
    handleCompletionParamsChange,
    handleVarListChange,
    handleAddVariable,
    handleContextVarChange,
    filterInputVar,
    filterVar,
    handlePromptChange,
    handleMemoryChange,
    handleVisionResolutionChange,
    isShowSingleRun,
    hideSingleRun,
    inputVarValues,
    setInputVarValues,
    visionFiles,
    setVisionFiles,
    contexts,
    setContexts,
    runningStatus,
    handleRun,
    handleStop,
    varInputs,
    runResult,
  } = useConfig(id, data)

  const model = inputs.model

  const singleRunForms = (() => {
    const forms: FormProps[] = []

    if (varInputs.length > 0) {
      forms.push(
        {
          label: t(`${i18nPrefix}.singleRun.variable`)!,
          inputs: varInputs,
          values: inputVarValues,
          onChange: setInputVarValues,
        },
      )
    }

    if (inputs.context?.variable_selector && inputs.context?.variable_selector.length > 0) {
      forms.push(
        {
          label: t(`${i18nPrefix}.context`)!,
          inputs: [{
            label: '',
            variable: '#context#',
            type: InputVarType.contexts,
            required: false,
          }],
          values: { '#context#': contexts },
          onChange: keyValue => setContexts((keyValue as any)['#context#']),
        },
      )
    }

    if (isShowVisionConfig) {
      forms.push(
        {
          label: t(`${i18nPrefix}.vision`)!,
          inputs: [{
            label: t(`${i18nPrefix}.files`)!,
            variable: '#files#',
            type: InputVarType.files,
            required: false,
          }],
          values: { '#files#': visionFiles },
          onChange: keyValue => setVisionFiles((keyValue as any)['#files#']),
        },
      )
    }

    return forms
  })()

  return (
    <div className='mt-2'>
      <div className='px-4 pb-4 space-y-4'>
        <Field
          title={t(`${i18nPrefix}.model`)}
        >
          <ModelParameterModal
            popupClassName='!w-[387px]'
            isInWorkflow
            isAdvancedMode={true}
            mode={model?.mode}
            provider={model?.provider}
            completionParams={model?.completion_params}
            modelId={model?.name}
            setModel={handleModelChanged}
            onCompletionParamsChange={handleCompletionParamsChange}
            hideDebugWithMultipleModel
            debugWithMultipleModel={false}
            readonly={readOnly}
          />
        </Field>

        <Field
          title={t(`${i18nPrefix}.variables`)}
          operations={
            !readOnly ? <AddButton onClick={handleAddVariable} /> : undefined
          }
        >
          <VarList
            readonly={readOnly}
            nodeId={id}
            list={inputs.variables}
            onChange={handleVarListChange}
            filterVar={filterInputVar}
          />
        </Field>

        {/* knowledge */}
        <Field
          title={t(`${i18nPrefix}.context`)}
          tooltip={t(`${i18nPrefix}.contextTooltip`)!}
        >
          <VarReferencePicker
            readonly={readOnly}
            nodeId={id}
            isShowNodeName
            value={inputs.context?.variable_selector || []}
            onChange={handleContextVarChange}
            filterVar={filterVar}
          />

        </Field>

        {/* Prompt */}
        {model.name && (
          <ConfigPrompt
            readOnly={readOnly}
            isChatModel={isChatModel}
            isChatApp={isChatMode}
            isShowContext
            payload={inputs.prompt_template}
            variables={inputs.variables.map(item => item.variable)}
            onChange={handlePromptChange}
            hasSetBlockStatus={hasSetBlockStatus}
          />
        )}

        {/* Memory put place examples. */}
        {isChatMode && isChatModel && !!inputs.memory && (
          <div className='mt-4'>
            <div className='flex justify-between items-center h-8 pl-3 pr-2 rounded-lg bg-gray-100'>
              <div className='flex items-center space-x-1'>
                <div className='text-xs font-semibold text-gray-700 uppercase'>{t('workflow.nodes.common.memories.title')}</div>
                <TooltipPlus
                  popupContent={t('workflow.nodes.common.memories.tip')}
                >
                  <HelpCircle className='w-3.5 h-3.5 text-gray-400' />
                </TooltipPlus>
              </div>
              <div className='h-[18px] leading-[18px] px-1 rounded-[5px] border border-black/8 text-xs font-semibold text-gray-500 uppercase'>{t('workflow.nodes.common.memories.builtIn')}</div>
            </div>
            {/* Readonly User Query */}
            <div className='mt-4'>
              <Editor
                title={<div className='flex items-center space-x-1'>
                  <div className='text-xs font-semibold text-gray-700 uppercase'>user</div>
                  <TooltipPlus
                    popupContent={t('workflow.nodes.llm.roleDescription')}
                  >
                    <HelpCircle className='w-3.5 h-3.5 text-gray-400' />
                  </TooltipPlus>
                </div>}
                value={QUERY_PLACEHOLDER_TEXT}
                onChange={() => { }}
                variables={[]}
                readOnly
                isShowContext={false}
                isChatApp
                isChatModel
                hasSetBlockStatus={{
                  query: false,
                  history: true,
                  context: true,
                }}
              />
            </div>
          </div>
        )}

        {/* Memory */}
        {isChatMode && isChatModel && (
          <>
            <Split />
            <MemoryConfig
              readonly={readOnly}
              config={{ data: inputs.memory }}
              onChange={handleMemoryChange}
              canSetRoleName={isCompletionModel}
            />
          </>
        )}

        {/* Vision: GPT4-vision and so on */}
        {isShowVisionConfig && (
          <>
            <Split />
            <Field
              title={t(`${i18nPrefix}.vision`)}
              tooltip={t('appDebug.vision.description')!}
              operations={
                <ResolutionPicker
                  value={inputs.vision.configs?.detail || Resolution.high}
                  onChange={handleVisionResolutionChange}
                />
              }
            />
          </>
        )}
      </div>
      <Split />
      <div className='px-4 pt-4 pb-2'>
        <OutputVars>
          <>
            <VarItem
              name='output'
              type='string'
              description={t(`${i18nPrefix}.outputVars.output`)}
            />
            <VarItem
              name='usage'
              type='object'
              description={t(`${i18nPrefix}.outputVars.usage`)}
            />
          </>
        </OutputVars>
      </div>
      {isShowSingleRun && (
        <BeforeRunForm
          nodeName={inputs.title}
          onHide={hideSingleRun}
          forms={singleRunForms}
          runningStatus={runningStatus}
          onRun={handleRun}
          onStop={handleStop}
          result={<ResultPanel {...runResult} showSteps={false} />}
        />
      )}
    </div>
  )
}

export default React.memo(Panel)
