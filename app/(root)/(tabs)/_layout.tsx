import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: React.ReactElement;
  title: string;
}) => {
  const isEdgeTab = title === "Reportar" || title === "Ajuda";

  return (
    <View
      className={`flex flex-row w-full flex-1 min-w-[124px] min-h-[68px] rounded-full justify-center items-center mt-9 overflow-hidden ${
        focused && title === "Reportar" ? "ml-8" : ""
      } ${focused && title === "Ajuda" ? "mr-8" : ""}`}
    >
      {focused ? (
        <LinearGradient
          colors={["#45BF55", "#008D80"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 9999 }}
          className=" w-full h-full flex-row justify-center items-center my-auto "
        >
          {React.cloneElement(icon, {
            size: 24,
            color: "#262626",
          })}
          <Text className="text-[#262626] text-lg ml-2 font-nunitoBold">
            {title}
          </Text>
        </LinearGradient>
      ) : (
        <View className="size-full justify-center items-center">
          {React.cloneElement(icon, {
            size: 24,
            color: "#FFFFFF",
          })}
        </View>
      )}
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#262626",
          borderTopWidth: 1,
          position: "absolute",
          marginBottom: 24,
          minHeight: 72,
          marginHorizontal: 16,
          borderRadius: 50,
          overflow: "hidden",
          borderWidth: 2,
          borderColor: "#262626",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Reportar",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<FontAwesome name="camera" />}
              title="Reportar"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Histórico",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<MaterialCommunityIcons name="clipboard-text-clock" />}
              title="Histórico"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: "Conquistas",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<FontAwesome name="trophy" />}
              title="Conquistas"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "Ajuda",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<MaterialIcons name="help-center" />}
              title="Ajuda"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
