import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cart from "./cart";

vi.mock('react-router-dom', () => ({
    useOutletContext: vi.fn(),
}));

import { useOutletContext } from "react-router-dom";

const mockProducts = [
    {
        id: 1,
        title: 'Shoes',
        price: 50,
        image: 'shoes.png',
        quantity: 1
    },
    {
        id: 2,
        title: 'Shirt',
        price: 20,
        image: 'shirt.png',
        quantity: 2
    },
];

function renderCart(items, setItemsInCart = vi.fn()) {
    useOutletContext.mockReturnValue({ itemsInCart: items, setItemsInCart});
    return render(<Cart />);
}

describe('Cart Component', () => {
    describe('Rendering', () => {
        
        it('renders the heading', () => {
            renderCart(mockProducts);
            expect(screen.getByText('Items on the Cart'))
            .toBeInTheDocument();
        });

        it('renders all items', () => {
            renderCart(mockProducts);
            expect(screen.getByText('Shoes'))
            .toBeInTheDocument();
            expect(screen.getByText('Shirt'))
            .toBeInTheDocument();
        });

        it('renders correct quantities in inputs', () => {
            renderCart(mockProducts);
            const inputs = screen.getAllByRole('spinbutton');
            expect(inputs[0]).toHaveValue(1);
            expect(inputs[1]).toHaveValue(2);
        });

        it('renders an empty cart with no item', () => {
            renderCart([]);
            expect(screen.queryByRole('img')).not.toBeInTheDocument();
        });
    })

    describe('Total Calculation', () => {
        it('calculates total correctly', () => {
            renderCart(mockProducts);
            expect(screen.getByText(/Total/)).toHaveTextContent('$90');
        });

        it('shows $0 total for empty cart', () => {
            renderCart([]);
            expect(screen.getByText(/Total/)).toHaveTextContent('$0');
        })
    })

    describe('Quantity Controls', () => {

        it('increase quantity when + is clicked', async () => {
            const user = userEvent.setup();
            const setItemsInCart = vi.fn();
            renderCart(mockProducts, setItemsInCart);
            await user.click(screen.getAllByText('+')[0]);
            const updater = setItemsInCart.mock.calls[0][0];
            expect(updater(mockProducts)[0].quantity).toBe(2);
        });

        it('decrease quantity when - is clicked after incrementing', async () => {
            const user = userEvent.setup();
            const seItemsInCart = vi.fn();
            renderCart(mockProducts, seItemsInCart);
            await user.click(screen.getAllByText('-')[1]);
            const updater = seItemsInCart.mock.calls[0][0];
            expect(updater(mockProducts)[1].quantity).toBe(1);
        });

        it('does not go below 1 when decrementing at 1', async () => {
            const user = userEvent.setup();
            const setItemsInCart = vi.fn();
            renderCart(mockProducts, setItemsInCart);
            await user.click(screen.getAllByText('-')[0]);
            const updater = setItemsInCart.mock.calls[0][0];
            expect(updater(mockProducts)[0].quantity).toBe(1);
        });

        it('only changes the targeted product quantity', async () => {
            const user = userEvent.setup();
            const setItemsInCart = vi.fn();
            renderCart(mockProducts, setItemsInCart);
            await user.click(screen.getAllByText('+')[0]);
            const updater = setItemsInCart.mock.calls[0][0]
            expect(updater(mockProducts)[0].quantity).toBe(2);
            expect(updater(mockProducts)[1].quantity).toBe(2);
        });
    });

    describe('removing of items', () => {
        it('removes the items', async () => {
            const user = userEvent.setup();
            const setItemsInCart = vi.fn();
            renderCart(mockProducts, setItemsInCart);
            await user.click(screen.getAllByText('Delete')[0]);
            const updater = setItemsInCart.mock.calls[0][0];
            const result = updater(mockProducts);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(2);
        })
    })
})