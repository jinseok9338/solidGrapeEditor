import { AiTwotoneCheckCircle } from "solid-icons/ai";
import { AiOutlineCloseCircle } from "solid-icons/ai";

import { grapesjs, type Editor, type ProjectData } from "grapesjs";
//import { useCallback, useMemo, useState } from 'react';
//import CustomEditor from './examples/CustomEditor';
//import DefaultEditor from './examples/DefaultEditor';
import EditorWaitReady from "./examples/EditorWaitReady";
import { getDateString } from "./examples/common";

import { createEffect, createSignal, Show } from "solid-js";
import DefaultEditor from "./examples/DefaultEditor";
import { create } from "domain";
//import DefaultCustomEditor from './examples/DefaultCustomEditor';

enum Examples {
  Default = "Default UI Editor",
  // Custom = 'Custom UI Editor',
  // DefaultCustom = 'Default & Custom UI Editor',
  WaitReady = "Editor wait Ready",
}

function App() {
  const [editor, setEditor] = createSignal<Editor>();
  const [ready, setReady] = createSignal<Editor>();
  const [projectData, setProjectData] = createSignal<ProjectData>();
  const [projectDataDate, setProjectDataDate] = createSignal<Date>();
  const [selectedExample, setSelectedExample] = createSignal(Examples.Default);
  const mountedIconCls = `inline-block ${
    editor() ? "text-green-400" : "text-red-400"
  }`;
  const readyIconCls = `inline-block ${
    ready() ? "text-green-400" : "text-red-400"
  }`;

  const onProjectUpdate = (pd: ProjectData) => {
    setProjectData(pd);
    setProjectDataDate(new Date());
  };

  const exampleOptions = Object.entries(Examples).map(([key, value]) => (
    <option value={value}>{value}</option>
  ));

  const onExampleChange = (value: string) => {
    setSelectedExample(value as Examples);
    setEditor(undefined);
    setReady(undefined);
  };

  let EditorToRender = DefaultEditor;

  // switch (selectedExample()) {
  //   // case Examples.Custom:
  //   //   EditorToRender = CustomEditor;
  //   //   break;
  //   // case Examples.DefaultCustom:
  //   //   EditorToRender = DefaultCustomEditor;
  //   //   break;
  //   case Examples.WaitReady:
  //     EditorToRender = EditorWaitReady;
  //     break;

  // }

  // createEffect(() => {
  //   switch (selectedExample()) {
  //     case Examples.Default:
  //       setEditor(defaultEditor);
  //       break;
  //     case Examples.WaitReady:
  //       setEditor(waitReadyEditor);
  //       break;
  //   }
  // });
  // (window as any).editor = editor();

  return (
    <div class="flex flex-col h-screen text-sm text-white bg-slate-900">
      <div class="flex gap-3 p-3 items-center">
        <div>
          <select
            class="rounded-sm bg-slate-700 p-1"
            value={selectedExample()}
            onChange={(e) => onExampleChange(e.target.value)}
          >
            {exampleOptions}
          </select>
        </div>
        <div class="flex gap-2 items-center">
          Mounted:
          {/* <Icon
            size={0.7}
            path={editor() ? mdiCheckBold : mdiClose}
            class={mountedIconCls}
          /> */}
          {/* {editor() ? (
            <AiTwotoneCheckCircle size={0.7} />
          ) : (
            <AiOutlineCloseCircle size={0.7} />
          )} */}
          <Show when={editor()} fallback={<AiOutlineCloseCircle size={20} />}>
            <AiTwotoneCheckCircle size={20} />
          </Show>
        </div>
        <div class="flex gap-2 items-center">
          Ready:
          {/* <Icon
            size={0.7}
            path={ready() ? mdiCheckBold : mdiClose}
            class={readyIconCls}
          /> */}
          {ready() ? (
            <AiTwotoneCheckCircle size={20} />
          ) : (
            <AiOutlineCloseCircle size={20} />
          )}
        </div>
        {!!projectDataDate() && (
          <div>Last update: {getDateString(projectDataDate())}</div>
        )}
      </div>
      <div class="flex-grow overflow-hidden">
        <EditorToRender
          onEditor={setEditor}
          onReady={setReady}
          onUpdate={onProjectUpdate}
          //grapesjs={grapesjs}
        />
      </div>
    </div>
  );
}

export default App;
