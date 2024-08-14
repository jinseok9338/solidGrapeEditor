import type { Meta, StoryObj } from "storybook-solidjs";
import { FrameHandler } from "./FrameHandler";

const meta = {
  title: "Example/FrameHandler",
  component: FrameHandler,
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
} satisfies Meta<typeof FrameHandler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    name: "Frame 2",
    children: <div>Hello World</div>,
  },
};
