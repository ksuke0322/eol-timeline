import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../sheet'

test('基本的なシートのa11yチェック', async () => {
  const { container } = render(
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you sure absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('左側から開くシートのa11yチェック', async () => {
  const { container } = render(
    <Sheet>
      <SheetTrigger>Open Left</SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('上側から開くシートのa11yチェック', async () => {
  const { container } = render(
    <Sheet>
      <SheetTrigger>Open Top</SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('下側から開くシートのa11yチェック', async () => {
  const { container } = render(
    <Sheet>
      <SheetTrigger>Open Bottom</SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('オーバーフローするコンテンツを持つシートのa11yチェック', async () => {
  const { container } = render(
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Overflowing Content</SheetTitle>
          <SheetDescription>
            This sheet contains a lot of content to demonstrate scrolling.
          </SheetDescription>
        </SheetHeader>
        <div style={{ height: '100px', overflowY: 'auto' }}>
          {Array.from({ length: 50 }).map((_, index) => (
            <p key={index}>Content item #{index + 1}</p>
          ))}
        </div>
      </SheetContent>
    </Sheet>,
  )
  expect(await axe(container)).toHaveNoViolations()
})
