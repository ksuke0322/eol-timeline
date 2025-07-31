import { within, expect, userEvent, waitFor } from '@storybook/test'
import { HomeIcon, SettingsIcon, UsersIcon } from 'lucide-react'
import { useState } from 'react'

import type { Meta, StoryObj, StoryContext } from '@storybook/react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter,
  SidebarInput,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '~/components/ui/sidebar'

const meta = {
  title: 'UI/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context: StoryContext) => (
      <div style={{ display: 'flex', height: '100vh' }}>
        {Story(context.args)}
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args: Parameters<typeof Sidebar>[0]) => {
    const [activeItem, setActiveItem] = useState('dashboard')

    return (
      <SidebarProvider>
        <Sidebar {...args}>
          <SidebarHeader>
            <SidebarInput placeholder="Search..." />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeItem === 'dashboard'}
                  onClick={() => setActiveItem('dashboard')}
                >
                  <HomeIcon />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeItem === 'users'}
                  onClick={() => setActiveItem('users')}
                >
                  <UsersIcon />
                  <span>Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeItem === 'settings'}
                  onClick={() => setActiveItem('settings')}
                >
                  <SettingsIcon />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator />
            <SidebarTrigger />
          </SidebarFooter>
        </Sidebar>
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <h1>Main Content Area</h1>
          <p>This is where your main application content would go.</p>
        </div>
      </SidebarProvider>
    )
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const dashboardButton = canvas.getByRole('button', { name: 'Dashboard' })
    const usersButton = canvas.getByRole('button', { name: 'Users' })

    await expect(dashboardButton).toHaveAttribute('data-active', 'true')
    await expect(usersButton).toHaveAttribute('data-active', 'false')

    await userEvent.click(usersButton)

    await expect(dashboardButton).toHaveAttribute('data-active', 'false')
    await expect(usersButton).toHaveAttribute('data-active', 'true')
  },
}

export const Collapsible: Story = {
  args: {
    collapsible: 'icon',
  },
  render: (args: Parameters<typeof Sidebar>[0]) => (
    <SidebarProvider>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Dashboard">
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Users">
                <UsersIcon />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <SettingsIcon />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Main Content Area</h1>
        <p>This is where your main application content would go.</p>
      </div>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const sidebar = canvas.getByRole('navigation')
    const trigger = canvas.getByRole('button', { name: 'Toggle Sidebar' })

    await expect(sidebar).toHaveAttribute('data-state', 'expanded')
    await userEvent.click(trigger)
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed')
    await userEvent.click(trigger)
    await expect(sidebar).toHaveAttribute('data-state', 'expanded')
  },
}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: (args: Parameters<typeof Sidebar>[0]) => (
    <SidebarProvider>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <UsersIcon />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <SettingsIcon />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Main Content Area</h1>
        <p>This is where your main application content would go.</p>
      </div>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const sidebar = canvas.getByRole('navigation')
    await expect(sidebar).toHaveAttribute('data-variant', 'sidebar')
  },
}

export const Floating: Story = {
  args: {
    variant: 'floating',
  },
  render: (args: Parameters<typeof Sidebar>[0]) => (
    <SidebarProvider>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <UsersIcon />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <SettingsIcon />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Main Content Area</h1>
        <p>This is where your main application content would go.</p>
      </div>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const sidebar = canvas.getByRole('navigation')
    await expect(sidebar).toHaveAttribute('data-variant', 'floating')
  },
}

export const Inset: Story = {
  args: {
    variant: 'inset',
  },
  render: (args: Parameters<typeof Sidebar>[0]) => (
    <SidebarProvider>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <UsersIcon />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <SettingsIcon />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <h1>Main Content Area</h1>
        <p>This is where your main application content would go.</p>
      </SidebarInset>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const sidebar = canvas.getByRole('navigation')
    await expect(sidebar).toHaveAttribute('data-variant', 'inset')
  },
}

export const RightSide: Story = {
  args: {
    side: 'right',
  },
  render: (args: Parameters<typeof Sidebar>[0]) => (
    <SidebarProvider>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <UsersIcon />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <SettingsIcon />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Main Content Area</h1>
        <p>This is where your main application content would go.</p>
      </div>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const sidebar = canvas.getByRole('navigation')
    await expect(sidebar).toHaveAttribute('data-side', 'right')
  },
}

export const RightSideCollapsible: Story = {
  args: {
    side: 'right',
    collapsible: 'icon',
  },
  render: (args: Parameters<typeof Sidebar>[0]) => (
    <SidebarProvider>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Dashboard">
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Users">
                <UsersIcon />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <SettingsIcon />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Main Content Area</h1>
        <p>This is where your main application content would go.</p>
      </div>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const sidebar = canvas.getByRole('navigation')
    const trigger = canvas.getByRole('button', { name: 'Toggle Sidebar' })

    await expect(sidebar).toHaveAttribute('data-side', 'right')
    await expect(sidebar).toHaveAttribute('data-state', 'expanded')
    await userEvent.click(trigger)
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed')
    await userEvent.click(trigger)
    await expect(sidebar).toHaveAttribute('data-state', 'expanded')
  },
}

export const WithManyMenuItems: Story = {
  render: (args: Parameters<typeof Sidebar>[0]) => (
    <SidebarProvider>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {Array.from({ length: 20 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton>
                  <HomeIcon />
                  <span>{`Menu Item ${i + 1}`}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Main Content Area</h1>
      </div>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const sidebarContent = canvas.getByTestId('sidebar-content')

    // スクロール可能であることを確認
    await expect(sidebarContent.scrollHeight).toBeGreaterThan(
      sidebarContent.clientHeight,
    )
  },
}

export const WithNestedSubMenus: Story = {
  render: (args: Parameters<typeof Sidebar>[0]) => (
    <SidebarProvider>
      <Sidebar {...args}>
        <SidebarHeader>
          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton>Sub Item 1</SidebarMenuSubButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        Sub-Sub Item 1
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton>Sub Item 2</SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <UsersIcon />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Main Content Area</h1>
      </div>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const subItem1Button = await waitFor(() => canvas.getByText('Sub Item 1'))
    const subSubItem1Button = await waitFor(() =>
      canvas.getByText('Sub-Sub Item 1'),
    )

    await expect(subItem1Button).toBeVisible()
    await expect(subSubItem1Button).toBeVisible()
  },
}
