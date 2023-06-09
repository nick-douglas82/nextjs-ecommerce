import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api/api";
import Logo from "../Icons/Logo";
import { Collection } from "@/types/Collection";
import { useBasketState } from "@/hooks/useBasket";
import Basket from "@/components/Basket/Basket"
import { useUserState } from "@/hooks/useUser";

const NavBar = () => {
    const userState = useUserState();
    const [collections, setCollections] = useState<Collection[] | null>(null);
    const basketState = useBasketState();

    // TODO: Can we improve this? We're fetching the collections twice, once here and once on the main homepage & this is client side only...
    useEffect(() => {
        async function fetchCollections() {
            try {
                const collections = await apiFetch<Collection[]>(`/api/collections/get-all-collections`);
                setCollections(collections);
            } catch (error) {
                return {
                    redirect: {
                        destination: '/error',
                        permanent: false,
                    },
                };
            }
        }
        fetchCollections();
    }, []);

    return (
        <div className="bg-white">
            <div className="px-4 mx-auto sm:px-6 lg:px-8">
                <div className="border-b border-gray-200">
                    <div className="flex items-center justify-between h-16">
                        <div className="hidden lg:flex lg:items-center">
                            <Link href="/" className="router-link-active router-link-exact-active">
                                <span className="sr-only">Your Company</span>
                                <Logo className="w-auto h-8" />
                            </Link>
                        </div>
                        <div className="hidden h-full lg:flex">
                            <nav className="ml-10">
                                <ul className="flex justify-center h-full space-x-8">
                                    {collections && collections.map((collection) => (
                                        <li className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800" key={collection.id}>
                                            <Link href={`/collections/${collection.slug}`}>{collection.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                            <div className="flex items-center lg:ml-8">
                                <div className="flex space-x-8">
                                    <div className="flex">
                                        {userState.auth ? (
                                            <Link href="/account/orders" className="p-2 -m-2 text-gray-400 appearance-none hover:text-gray-500">
                                                <span className="sr-only">Account</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg>
                                            </Link>
                                        ) : ''}
                                    </div>
                                </div>
                                <span className="w-px h-6 mx-4 bg-gray-200 lg:mx-6" aria-hidden="true"></span>
                                <div className="flow-root">
                                    <Basket itemsInBasket={basketState.basket.reduce((count, curItem) => {
                                        return count + curItem.quantity;
                                    }, 0)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default NavBar;