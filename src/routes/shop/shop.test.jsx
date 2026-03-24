import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Shop from "./shop";
import userEvent from "@testing-library/user-event";

vi.mock('./shop.module.css', () => ({ default: {} }));

vi.mock('../../api/fetchProduct', () => ({
    default: vi.fn(),
}));
import useFetchProduct from "../../api/fetchProduct";

const mockSetItemsInCart = vi.fn();
vi.mock('react-router-dom', () => ({
    useOutletContext: () => ({ setItemsInCart: mockSetItemsInCart}),
}));

const mockProducts = [
    {
        id: 1,
        title: 'Shoes',
        price: 49.99,
        image: 'shoes.png'
    },
    {
        id: 2,
        title: 'Shirt',
        price: 19.99,
        image: 'shirt.png'
    },
];

function renderShop() {
    return render(<Shop />);
}

describe('Shop Component', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Loading and Error States', () => {
        it('renders loading state when product is null', () => {
            useFetchProduct.mockReturnValue({ 
                product: null, 
                error: null});
            renderShop();
            expect(screen.getByText('Loading')).toBeInTheDocument();
        });

        it('renders error message when error is present', () => {
            useFetchProduct.mockReturnValue({
                product: null,
                error: { message: 'Failed to fetch'}
            });
            renderShop();
            expect(screen.getByText("Error: Failed to fetch")).toBeInTheDocument();
        });

        it('does not render product cards when loading', () => {
            useFetchProduct.mockReturnValue({ 
                product: null, 
                error: null 
            });
            renderShop();
            expect(screen.queryByRole('button', { name: 'Add to Cart'})).not.toBeInTheDocument();
        });
    });

    describe('Rendering', () => {
        beforeEach(() => {
            useFetchProduct.mockReturnValue({ 
                product: mockProducts, 
                error: null 
            });
        });

        it('render all products card', () => {
            renderShop();
            expect(screen.getByText('Shoes')).toBeInTheDocument();
            expect(screen.getByText('Shirt')).toBeInTheDocument();
        });

        it('renders product prices', () => {
            renderShop();
            expect(screen.getByText('$49.99')).toBeInTheDocument();
            expect(screen.getByText('$19.99')).toBeInTheDocument();
        });

        it('renders product images with correct src and alt', () => {
            renderShop();
            const shoesImg = screen.getByAltText('Shoes');
            expect(shoesImg).toHaveAttribute('src', 'shoes.png');
        });

        it('renders Add to Cart button for each product', () => {
            renderShop();
            expect(screen.getAllByRole('button', { name: 'Add to Cart' }))
            .toHaveLength(2);
        });

        it('renders + and - buttons for each product', () => {
            renderShop();
            expect(screen.getAllByText('+')).toHaveLength(2);
            expect(screen.getAllByText('-')).toHaveLength(2);
        });

        it('renders quantity inputs defaulting to 1', () => {
            renderShop();
            const inputs = screen.getAllByRole('spinbutton');
            inputs.forEach((input) => expect(input).toHaveValue(1));
        });
    });

    describe('Quantity Controls', () => {
        beforeEach(() => {
            useFetchProduct.mockReturnValue({
                product: mockProducts,
                error: null
            });
        });

        it('increase quantity when + is clicked', async () => {
            const user = userEvent.setup();
            renderShop();
            await user.click(screen.getAllByText('+')[0]);
            expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(2);
        });

        it('decrease quantity when - is clicked after incrementing', async () => {
            const user = userEvent.setup();
            renderShop();
            await user.click(screen.getAllByText('+')[0]);
            await user.click(screen.getAllByText('-')[0]);
            expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(1);
        });

        it('does not go below 1 when decrementing at 1', async () => {
            const user = userEvent.setup();
            renderShop();
            await user.click(screen.getAllByText('-')[0]);
            expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(1);
        });

        it('only changes the targeted product quantity', async () => {
            const user = userEvent.setup();
            renderShop();
            await user.click(screen.getAllByText('+')[0]);
            const inputs = screen.getAllByRole('spinbutton');
            expect(inputs[0]).toHaveValue(2);
            expect(inputs[1]).toHaveValue(1);
        });

        it('updates quantity via input change', async () => {
            const user = userEvent.setup();
            renderShop();
            const input = screen.getAllByRole('spinbutton')[0];
            await user.clear(input);
            await user.type(input, '5');
            expect(input).toHaveValue(5);
        });
    });

    describe('handleAddToCart', () => {
        beforeEach(() => {
            useFetchProduct.mockReturnValue({
                product: mockProducts,
                error: null
            });
        });

        it('calls setItemsInCart when Add to Cart is clicked', async () => {
            const user = userEvent.setup();
            renderShop();
            await user.click(screen.getAllByRole('button', { name: 'Add to Cart'})[0]);
            expect(mockSetItemsInCart).toHaveBeenCalledOnce();
        });

        it('add a new item with default quantity 1', async () => {
            const user = userEvent.setup();
            renderShop();
            await user.click(screen.getAllByRole('button', { name: 'Add to Cart'})[0]);
            const updater = mockSetItemsInCart.mock.calls[0][0];
            const result = updater([]);
            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({ id: 1, title: 'Shoes', quantity: 1});
        });

        it('adds a new item with incremented quantity', async () => {
            const user = userEvent.setup();
            renderShop();
            await user.click(screen.getAllByText('+')[0]);
            await user.click(screen.getAllByRole('button', { name: 'Add to Cart'})[0]);
            const updater = mockSetItemsInCart.mock.calls[0][0];
            const result = updater([]);
            expect(result[0].quantity).toBe(2);
        });

        it('increments quantity if item already exist in cart', async () => {
            const user = userEvent.setup();
            renderShop();
            await user.click(screen.getAllByRole('button', { name: 'Add to Cart'})[0]);
            const updater = mockSetItemsInCart.mock.calls[0][0];
            const existing = [{ id: 1, title: 'Shoes', price: 49.99, quantity: 3}];
            const result = updater(existing);
            expect(result[0].quantity).toBe(4);
        });

        it('does not duplicate item when added twice', async () => {
            const user = userEvent.setup();
            renderShop();
            await user.click(screen.getAllByRole('button', { name: 'Add to Cart'})[0]);
            const updater = mockSetItemsInCart.mock.calls[0][0];
            const existing = [{id: 1, title: 'Shoes', price: 49.99, quantity: 1}];
            const result = updater(existing);
            expect(result).toHaveLength(1);
        });

        it('adds a different item without affecting existing cart items', async () => {
            const user = userEvent.setup();
            renderShop();
            await user.click(screen.getAllByRole('button', { name: 'Add to Cart'})[1]);
            const updater = mockSetItemsInCart.mock.calls[0][0];
            const existing = [{id: 1, title: 'Shoes', price: 49.99, quantity: 1}];
            const result = updater(existing);
            expect(result).toHaveLength(2);
            expect(result[0].quantity).toBe(1);
            expect(result[1]).toMatchObject({id: 2, title: 'Shirt', quantity: 1 })
        });
    });
});