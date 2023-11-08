import {render, screen} from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  test('renders text with link', () => {
    render(<MyComponent />)

    const textElement = screen.getByText(/Maxi/, {exact: false})
    expect(textElement).toBeInTheDocument()

    const linkElement = screen.getByRole('link')
    expect(linkElement).toBeInTheDocument()
  })
})