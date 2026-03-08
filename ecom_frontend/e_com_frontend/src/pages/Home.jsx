import ProductsTogether from "../components/ProductsTogether";
import SignOutButton from "../components/SignOutButton";

function Home() {
    return (
        <>
            {/* <div> */}
            <div className="max-w-7xl mx-auto px-6">
                {/* <div className="pl-12 mt-6"> */}
                <div className="mt-8 mb-6">
                    <h1 className="text-lg font-bold">Products</h1>
                    <p className="text-sm font-light">
                        Thoughtfully designed essentials for everyday life
                    </p>
                </div>
                <ProductsTogether />
            </div>
        </>
    );
}

export default Home;
