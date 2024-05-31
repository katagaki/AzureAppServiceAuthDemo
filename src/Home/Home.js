import "./Home.css";
import {useEffect, useState, forwardRef} from "react";
import {
    FluentProvider,
    webDarkTheme,
    Button,
    Field,
    Menu,
    MenuItemLink,
    MenuList,
    MenuPopover,
    MenuTrigger,
    Persona,
    Textarea
} from "@fluentui/react-components";

function Login() {
    const [userDataString, setUserDataString] = useState(null);
    const [userName, setUserName] = useState(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const onOpenChange = (e, data) => {
        setIsMenuOpen(data.open);
    };
    const PersonaMenuTrigger = forwardRef((props, ref) => (
            <Persona {...props}
                     ref={ref}
                     className="personaWithPointerCursor"
                     name={userName}
                     secondaryText="Logged In"
                     presence={{status: "available"}}
            />
        ))
    ;

    const signIn = () => {
        window.open("/login", "_self");
    }

    useEffect(() => {
        async function getUserData() {
            const response = await fetch("/.auth/me");
            const payload = await response.json();
            const {clientPrincipal} = payload;
            if (clientPrincipal) {
                setUserDataString(JSON.stringify(clientPrincipal, null, 4));

                if (Object.hasOwn(clientPrincipal, "claims")) {
                    const name = clientPrincipal.claims.find(item => item.typ === "name");
                    if (name) {
                        setUserName(name.val);
                    } else {
                        console.log("Auth data did not contain a name.");
                    }
                }
            }
        }

        getUserData();
    }, []);

    return (
        <FluentProvider theme={webDarkTheme}>
            <div className="mainContent">
                <h1 style={{textAlign: "center"}}>Authentication &amp; Authorization with Azure App Service</h1>
                <div style={{textAlign: "center"}}>
                    {userName ? (
                        <Menu open={isMenuOpen} onOpenChange={onOpenChange}>
                            <MenuTrigger disableButtonEnhancement>
                                <PersonaMenuTrigger/>
                            </MenuTrigger>
                            <MenuPopover>
                                <MenuList>
                                    <MenuItemLink
                                        href="/logout">Sign Out</MenuItemLink>
                                </MenuList>
                            </MenuPopover>
                        </Menu>
                    ) : (
                        <Button appearance="primary" onClick={signIn}>Sign in With Microsoft Entra ID</Button>
                    )}
                </div>
                <div>
                    <Field label="JWT Claims">
                        <Textarea style={{height: "200px"}}
                                  value={userDataString ? userDataString : ("Not Signed In")}/>
                    </Field>
                </div>
            </div>
        </FluentProvider>
    )
        ;
}

export default Login;
