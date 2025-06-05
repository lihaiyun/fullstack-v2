import { useContext } from "react";
import UserContext from "@/contexts/UserContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function MainMenu() {
  const { user } = useContext(UserContext);

  return (
    <nav className="flex container mx-auto px-4 my-4">
      <NavigationMenu>
        <NavigationMenuList>
          <div className="flex gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink className="text-lg" href="/">
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="text-lg" href="/projects">
                Projects
              </NavigationMenuLink>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu className="ml-auto">
        <NavigationMenuList className="flex">
          <div className="flex gap-2">
            {user ? (
              <span className="text-lg font-bold px-2">{user.name}</span>
            ) : (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink className="text-lg" href="/user/login">
                    Login
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="text-lg" href="/user/register">
                    Register
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}