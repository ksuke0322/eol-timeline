import { render, screen } from '@testing-library/react'

import Home from '../home'

describe.skip('Home', () => {
  it('main contentが表示されること', () => {
    render(<Home />)
    expect(screen.getByText('main content')).toBeInTheDocument()
  })
})
