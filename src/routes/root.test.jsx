import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import Root from "./root";

vi.mock('react-router-dom', () => ({
    NavLink: ({to, children}) => <a href={to}>{children}</a>,
    Outlet: ({ context }) => (
        <div 
        data-testid="outlet" 
        data-cart-length={context.itemsInCart.length} 
        />
    ),
}));

function renderRoot() {
    return render(<Root />);
}

describe('Root Component', () => {

    describe('Rendering', () => {
        it('renders the Home nav link', () => {
            renderRoot();
            expect(screen.getByRole('link', { name: "Home" }))
            .toBeInTheDocument();
        });

        it('renders the Shop nav link', () => {
            renderRoot();
            expect(screen.getByRole('link', { name: "Shop" }))
            .toBeInTheDocument();
        });

        it('renders the Cart nav link', () => {
            renderRoot();
            expect(screen.getByRole('link', { name: "Cart" }))
            .toBeInTheDocument();
        });

        it('render the Outlet', () => {
            renderRoot();
            expect(screen.getByTestId('outlet')).toBeInTheDocument();
        });

        it('renders cart item count starting at 0', () => {
            renderRoot();
            expect(screen.getByText('0')).toBeInTheDocument();
        });
    })

    describe('Nav Links href', () => {
        it('Home link points to /', () => {
            renderRoot();
            expect(screen.getByRole('link', { name: "Home" }))
            .toHaveAttribute('href', '/');
        });

        it('Shop link points to shop', () => {
            renderRoot();
            expect(screen.getByRole('link', { name: "Shop" }))
            .toHaveAttribute('href', 'shop')
        });

        it('Cart link points to cart', () => {
            renderRoot();
            expect(screen.getByRole('link', { name: "Cart" }))
            .toHaveAttribute('href', "cart")
        });
    })

    describe('Outlet Context', () => {
        it('passes empty itemsInCart array to outlet initially', () => {
            renderRoot();
            const outlet = screen.getByTestId('outlet');
            expect(outlet).toHaveAttribute('data-cart-length', '0');
        });
    });
});