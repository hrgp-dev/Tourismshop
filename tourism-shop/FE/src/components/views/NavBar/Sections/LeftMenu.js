import React from "react";
import { Menu } from "antd";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
	return (
		<Menu mode={props.mode}>
			<Menu.Item key="mail">
				<a href="/">Home</a>
			</Menu.Item>
			<SubMenu title={<span>Explore</span>}>
				<MenuItemGroup>
					<Menu.Item key="About Us">About Us</Menu.Item>
					<Menu.Item key="Contact Us">Contact Us</Menu.Item>
				</MenuItemGroup>
				<hr></hr>
				<MenuItemGroup>
					<Menu.Item key="Help">Help</Menu.Item>
					<Menu.Item key="Visit">Visit</Menu.Item>
				</MenuItemGroup>
			</SubMenu>
		</Menu>
	);
}

export default LeftMenu;
