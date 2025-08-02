import { render } from '@testing-library/react'
import { HomeIcon } from 'lucide-react'
import { axe } from 'vitest-axe'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  SidebarInput,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from '../sidebar'

test('基本的なサイドバーのa11yチェック', async () => {
  const { container } = render(
    <SidebarProvider>
      <Sidebar>
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
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('折りたたみ可能なサイドバーのa11yチェック', async () => {
  const { container } = render(
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dashboard">
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('モバイル表示のサイドバーのa11yチェック', async () => {
  const { container } = render(
    <SidebarProvider>
      <Sidebar>
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
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('フローティングサイドバーのa11yチェック', async () => {
  const { container } = render(
    <SidebarProvider>
      <Sidebar variant="floating">
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
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('インセットサイドバーのa11yチェック', async () => {
  const { container } = render(
    <SidebarProvider>
      <Sidebar variant="inset">
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
      </SidebarInset>
    </SidebarProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('右側サイドバーのa11yチェック', async () => {
  const { container } = render(
    <SidebarProvider>
      <Sidebar side="right">
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
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('右側で折りたたみ可能なサイドバーのa11yチェック', async () => {
  const { container } = render(
    <SidebarProvider>
      <Sidebar side="right" collapsible="icon">
        <SidebarHeader>
          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dashboard">
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('多数のメニュー項目を持つサイドバーのa11yチェック', async () => {
  const { container } = render(
    <SidebarProvider>
      <Sidebar>
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
    </SidebarProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('ネストされたサブメニューを持つサイドバーのa11yチェック', async () => {
  const { container } = render(
    <SidebarProvider>
      <Sidebar>
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
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarTrigger />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})
