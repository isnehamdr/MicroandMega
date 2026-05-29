import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    X,
    Menu,
    Image,
    FileText,
    Calendar,
    LayoutDashboard,
    List,
    Newspaper,
    Users2,
    Package,
    FolderKanban,
    MessageSquare,
    Ticket,
    Activity,
    UserCircle,
    FolderTree, // Add this import
} from "lucide-react";



const SideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url } = usePage();
    const currentPath = url.split("/")[1];

    const isActive = (href) => {
        const path = href.replace("/", "");
        return currentPath === path;
    };

    // Get authenticated user from auth prop
    const { auth } = usePage().props;
    const user = auth?.user;

    // Check The Role of the User
    const isAdmin = user?.role === "admin";


    
    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            <div
                className={`
                    fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300
                    ${isCollapsed ? "w-16" : "w-64"}
                    ${
                        isMobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }
                `}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between p-4 border-b h-16 ${
                        isCollapsed ? "px-3" : ""
                    }`}
                >
                    {!isCollapsed && (
                        <Link
                            href="/"
                            className="flex items-center whitespace-nowrap"
                        >
                            <img
                                src="/images/logo.png"
                                alt="Microandmega"
                                className="h-12 w-auto"
                            />
                        </Link>
                    )}
                    <div className="flex items-center space-x-1">
                        {/* Collapse Toggle Button - Only show on desktop */}
                        <button
                            onClick={onToggleCollapse}
                            className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            title={
                                isCollapsed
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                        >
                            <Menu className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* Mobile Close Button */}
                        <button
                            onClick={onMobileToggle}
                            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Menu Items */}
                <div
                    className={`p-2 space-y-1 ${isCollapsed ? "px-2" : "px-3"}`}
                >
                    {/* Dashboard */}
                    <Link
                        href="/dashboard"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/dashboard")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Dashboard" : ""}
                    >
                        <LayoutDashboard
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/dashboard")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Dashboard
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Dashboard
                            </div>
                        )}
                    </Link>



 {/* HeroSection - Using FolderTree icon instead of Package */}
                    <Link
                        href="/hero-section"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/hero-section")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Hero Component" : ""}
                    >
                        <img 
                            src="/images/home.png"
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/hero-section")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Hero Component
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Hero Component
                            </div>
                        )}
                    </Link>



                    {/* Category - Using FolderTree icon instead of Package */}
                    <Link
                        href="/category"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/category")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Category" : ""}
                    >
                        <FolderTree
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/category")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Category
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Category
                            </div>
                        )}
                    </Link>

                    {/* Products - Using Package icon */}
                    <Link
                        href="/products"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/products")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Products" : ""}
                    >
                        <Package
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/products")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Products
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Products
                            </div>
                        )}
                    </Link>

                    {/* Projects - Using FolderKanban icon */}
                    <Link
                        href="/projects"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/projects")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Projects" : ""}
                    >
                        <FolderKanban
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/projects")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Projects
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Projects
                            </div>
                        )}
                    </Link>

                    {/* Testimonials - Using MessageSquare icon */}
                    <Link
                        href="/testimonials"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/testimonials")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Testimonials" : ""}
                    >
                        <MessageSquare
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/testimonials")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Testimonials
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Testimonials
                            </div>
                        )}
                    </Link>

                    {/* Service Tickets - Using Ticket icon */}
                    <Link
                        href="/service-tickets"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/service-tickets")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Service Tickets" : ""}
                    >
                        <Ticket
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/service-tickets")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Service Tickets
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Service Tickets
                            </div>
                        )}
                    </Link>

                    {/* Users - Using UserCircle icon */}
                    <Link
                        href="/user"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/user")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Users" : ""}
                    >
                        <UserCircle
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/user")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Users
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Users
                            </div>
                        )}
                    </Link>

                    {/* Activity Logs - Using Activity icon */}
                    <Link
                        href="/log"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${
                                isActive("/log")
                                    ? "bg-gray-200 text-gray-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }
                        `}
                        title={isCollapsed ? "Activity Logs" : ""}
                    >
                        <Activity
                            className={`
                            ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
                            ${
                                isActive("/log")
                                    ? "text-gray-600"
                                    : "text-gray-500 group-hover:text-gray-700"
                            }
                        `}
                        />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Activity Logs
                            </span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Activity Logs
                            </div>
                        )}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SideBar;