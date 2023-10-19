import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit, AiFillPlusSquare } from "react-icons/ai";
import { Link } from "react-router-dom";
import { delete_product, get_products } from "../api/products";
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";


import { toast } from "react-hot-toast";
import Loader from "./Loader"
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Product } from "../Interfaces";
// import { prod }



const Products = () => {
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    const {
        data,
        isLoading,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery(
        ['products'],
        get_products,
        {
            getNextPageParam: (page: any) => page.meta.next
        }
    );

    console.log(data)


    const queryClient = useQueryClient();


    const deleteProdMutation = useMutation({
        mutationFn: delete_product,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Xóa sản phẩm thành công !")

        },
        onError: () => {
            toast.error("Xóa sản phẩm thất bại!!! !")
        },
    });

    if (deleteProdMutation.isLoading) return <Loader />;
    if (error instanceof Error) return <>{toast.error(error.message)}</>


    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">Mã SP</th>
                        <th scope="col" className="px-4 py-3">Tên</th>
                        <th scope="col" className="px-4 py-3">Giá</th>
                        <th scope="col" className="px-4 py-3">Mô tả</th>
                        <th scope="col" className="px-4 py-3 flex items-center justify-center gap-4">Actions
                            <Link
                                to="add"
                            >
                                <AiFillPlusSquare size={22} className="text-green-300 cursor-pointer" />
                            </Link></th>
                    </tr>
                </thead>



                {data?.pages.map((page: any) => (
                    <>

                        <tbody
                            key={page.meta.next}
                        >
                            {page?.data?.map((product: Product) => (
                                <tr className="border-b dark:border-gray-700">
                                    <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.id}
                                    </th>
                                    <td className="px-4 py-3">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.price}
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.description}
                                    </td>

                                    <td className="px-4 py-3 flex items-center justify-center gap-4">

                                        <BsFillTrashFill
                                            onClick={() => {
                                                if (product.id !== undefined) { deleteProdMutation.mutate(product.id) }
                                            }
                                            }
                                            size={22}
                                            className="text-red-300 cursor-pointer" />

                                        <Link to={`edit/${product.id}`}>
                                            <AiFillEdit size={22} className="text-green-300 cursor-pointer" />
                                        </Link>

                                    </td>
                                </tr>
                            ))}
                        </tbody >


                        {!isLoading && data?.pages.length === 0 && (
                            <p className="text-xl text-slate-800 dark:text-slate-200">
                                No more results
                            </p>
                        )}
                        {!isLoading &&
                            data?.pages?.length !== undefined &&
                            data.pages.length > 0 &&
                            hasNextPage && (
                                <div ref={ref}>
                                    {isLoading || isFetchingNextPage ? (
                                        <p>Loading...</p>
                                    ) : null}
                                </div>
                            )}
                    </>
                ))}
            </table >
        </div >
    );
};


export default Products;