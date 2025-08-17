import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  animation: ${fadeIn} 0.6s ease-out;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover { transform: translateY(-1px); }
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(102,126,234,0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -200px;
    width: 200px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

const LogoText = styled.div` display: flex; flex-direction: column; gap: 0.25rem; `;
const Logo = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  letter-spacing: -0.02em;
`;
const Tagline = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  opacity: 0.8;
`;

const AuthContainer = styled.div` display: flex; align-items: center; gap: 1rem; `;
const UserInfo = styled.div` display: flex; align-items: center; gap: 0.75rem; animation: ${slideDown} 0.4s ease-out; `;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: linear-gradient(135deg,#667eea,#764ba2);
`;
const AvatarLetter = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg,#667eea,#764ba2);
  display: flex; align-items: center; justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const WelcomeText = styled.div`
  display: flex; flex-direction: column;
  @media (max-width: 768px){ display: none; }
`;
const UserName = styled.span` font-weight:600; color:#2d3748; font-size:0.95rem; `;
const UserRole = styled.span` font-size:0.8rem; color:#64748b; opacity:0.8; `;

const Button = styled.button`
  padding:0.75rem 1.5rem;
  border:none;
  border-radius:12px;
  font-size:0.9rem;
  font-weight:600;
  cursor:pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  position: relative;
  overflow: hidden;

  ${props=>props.variant==='login' && `
    background: linear-gradient(135deg,#667eea,#764ba2);
    color:white;
    box-shadow:0 4px 15px rgba(102,126,234,0.3);
    &:hover { transform: translateY(-2px); box-shadow:0 6px 20px rgba(102,126,234,0.4); }
  `}
  ${props=>props.variant==='logout' && `
    background: rgba(239,68,68,0.1);
    color:#dc2626;
    border:1px solid rgba(239,68,68,0.2);
    &:hover { background: rgba(239,68,68,0.15); transform:translateY(-1px); box-shadow:0 4px 12px rgba(239,68,68,0.2); }
  `}
`;

const Navbar = () => {
  const [user, setUser] = useState(null);
  const backendURL = "https://minutemind-backend.onrender.com"; // Change to deployed backend URL when live

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if(storedUser) setUser(JSON.parse(storedUser));
    else {
      fetch(`${backendURL}/api/me`, { credentials: "include" })
        .then(res => res.json())
        .then(data => { 
          if(data?.email){ 
            setUser(data); 
            localStorage.setItem("user", JSON.stringify(data)); 
          }
        })
        .catch(()=>{});
    }
  }, []);

  const handleLogin = () => {
    const state = "dashboard";
    window.location.href = `${backendURL}/auth/google?state=${state}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    fetch(`${backendURL}/logout`, { method:"POST", credentials:"include" }).catch(()=>{});
  };

  return (
    <NavbarContainer>
      <LogoContainer>
        <LogoIcon>MM</LogoIcon>
        <LogoText>
          <Logo>MinuteMind</Logo>
          <Tagline>AI-powered meeting insights</Tagline>
        </LogoText>
      </LogoContainer>

      <AuthContainer>
        {user ? (
          <UserInfo>
            {user.picture 
              ? <Avatar src={user.picture} alt={user.name} />
              : <AvatarLetter>{user.name?.charAt(0)}</AvatarLetter>
            }
            <WelcomeText>
              <UserName>{user.name}</UserName>
              <UserRole>{user.email}</UserRole>
            </WelcomeText>
            <Button variant="logout" onClick={handleLogout}>Logout</Button>
          </UserInfo>
        ) : (
          <Button variant="login" onClick={handleLogin}>Sign In With Google</Button>
        )}
      </AuthContainer>
    </NavbarContainer>
  );
};

export default Navbar;
