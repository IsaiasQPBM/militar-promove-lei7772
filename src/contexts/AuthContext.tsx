
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock localStorage persistence
const saveUserToStorage = (user: User) => {
  localStorage.setItem("cbmepi-user", JSON.stringify(user));
};

const getUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem("cbmepi-user");
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing stored user", error);
    }
  }
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API delay

      // For demo purposes, any email/password combination works
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: "admin" // All users are admins for this demo
      };
      
      setUser(newUser);
      saveUserToStorage(newUser);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${newUser.name}!`,
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API delay

      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: "admin" // All users are admins for this demo
      };
      
      setUser(newUser);
      saveUserToStorage(newUser);
      toast({
        title: "Registro realizado com sucesso!",
        description: `Bem-vindo, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Erro ao registrar",
        description: "Verifique os dados inseridos e tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cbmepi-user");
    toast({
      title: "Logout realizado com sucesso!",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
