import { Link } from "react-router-dom";
import { Store, Users, Award, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About ShopHub</h1>
          <p className="text-xl opacity-90">Your trusted online shopping destination</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
            <p className="text-gray-600 mb-4">
              ShopHub is a leading online marketplace that connects buyers and sellers from around the world. 
              We strive to provide the best shopping experience with quality products, secure payments, and fast delivery.
            </p>
            <p className="text-gray-600 mb-6">
              Founded in 2024, we've grown to become one of the most trusted e-commerce platforms, serving millions 
              of customers worldwide. Our commitment to customer satisfaction and product quality sets us apart.
            </p>
          </div>
          <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
            <Store className="w-24 h-24 text-gray-400" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">50K+</p>
            <p className="text-gray-500">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">10K+</p>
            <p className="text-gray-500">Products</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">5+</p>
            <p className="text-gray-500">Years Experience</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">98%</p>
            <p className="text-gray-500">Satisfaction Rate</p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Quality First</h3>
              <p className="text-gray-600">
                We carefully curate every product to ensure the highest quality for our customers.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Customer Focus</h3>
              <p className="text-gray-600">
                Your satisfaction is our top priority. We're here to help you every step of the way.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Trust & Security</h3>
              <p className="text-gray-600">
                Your data and payments are secure with our advanced encryption and security measures.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-gray-600 mb-6">Join thousands of satisfied customers today!</p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

