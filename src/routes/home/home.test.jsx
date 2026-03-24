import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./home";
import { useNavigate } from "react-router-dom";

vi.mock('../../assets/background.png', () => ({
    default: 'background.png'
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

function renderHome(){
    return render(<Home />);
}

describe('Home Component', () => {

    describe('Rendering', () => {
        it('renders the hero image', () => {
            renderHome();
            const img = screen.getByAltText('Shopping cart');
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', 'background.png');
        });

        it('renders the title and subtitle', () => {
            renderHome();
            expect(screen.getByText('Shop Here'))
            .toBeInTheDocument();
            expect(screen.getByText('Find everything you need in one place.'))
            .toBeInTheDocument();
        });

        it('renders the Shop Now button', () => {
            renderHome();
            expect(screen.getByRole('button', {name: 'Shop Now'}))
            .toBeInTheDocument();
        });

        it('renders the credit link with correct attributes', () => {
            renderHome();
            const link = screen.getByRole('link', { name: /PYMNTS\.com/i});
            expect(link).toHaveAttribute('href', 'https://www.pymnts.com/innovation/2019/grocery-cameras-smart-shelves-retail-technology/');
            expect(link).toHaveAttribute('target', 'blank');
            expect(link).toHaveAttribute('rel', "noreferrer");
        })
    });

    describe('Navigation', () => {
        it('navigates to /shop when Shop Now is clicked', async () => {
            const user = userEvent.setup();
            renderHome();
            await user.click(screen.getByRole('button', {name: 'Shop Now'}));
            expect(mockNavigate).toHaveBeenCalled('/shop');
        })
    })
})