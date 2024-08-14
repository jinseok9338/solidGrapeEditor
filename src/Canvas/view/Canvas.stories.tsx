import type { Meta, StoryObj } from "storybook-solidjs";
import Canvas from ".";
import { convertToFramesAndComponents } from "@/utils";

const testHtml = `
<div class="w-full h-[200px] bg-gray-200 p-4 flex justify-center items-center">
  <div class="w-full h-[200px] bg-gray-200 p-4 flex justify-center items-center">
    <h1>Hello World</h1>
  </div>
</div>
`;

const { frames, components } = convertToFramesAndComponents(testHtml);

const meta = {
  title: "Example/Canvas",
  component: Canvas,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/solid/writing-docs/docs-page
  tags: ["autodocs"],
  decorators: [
    (Story: any) => (
      <div class="w-full h-[200px] bg-gray-200 p-4 flex justify-center items-center">
        <Story />
      </div>
    ),
  ],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/solid/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Canvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    components,
    frames,
  },
};
