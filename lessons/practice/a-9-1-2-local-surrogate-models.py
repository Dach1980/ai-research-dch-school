"""Compare global and local surrogate models. This is not an implementation of LIME.
Install: python -m pip install numpy matplotlib scikit-learn
Run: python lessons/practice/a-9-1-2-local-surrogate-models.py
"""
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_friedman1
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor

SEED=42
rng=np.random.default_rng(SEED)
X,y=make_friedman1(n_samples=2400,n_features=5,noise=1.2,random_state=SEED)
X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=.25,random_state=SEED)
black_box=RandomForestRegressor(n_estimators=220,min_samples_leaf=3,random_state=SEED,n_jobs=-1).fit(X_train,y_train)
print(f"Original model RMSE against true y: {mean_squared_error(y_test,black_box.predict(X_test))**.5:.4f}")
teacher_train,teacher_test=black_box.predict(X_train),black_box.predict(X_test)
def report(name,model,Xv,target):
    pred=model.predict(Xv)
    print(f"{name}: fidelity MAE={mean_absolute_error(target,pred):.4f}, RMSE={mean_squared_error(target,pred)**.5:.4f}")
    return pred
global_models={"Linear":LinearRegression(),"Tree depth 3":DecisionTreeRegressor(max_depth=3,min_samples_leaf=20,random_state=SEED)}
global_preds={}
for name,model in global_models.items():
    model.fit(X_train,teacher_train)
    global_preds[name]=report(name,model,X_test,teacher_test)
x0=X_test[0]
local_train=np.clip(x0+rng.normal(0,.12,size=(1600,X.shape[1])),0,1)
local_valid=np.clip(x0+rng.normal(0,.12,size=(600,X.shape[1])),0,1)
local_train_y,local_valid_y=black_box.predict(local_train),black_box.predict(local_valid)
local_models={"Local linear":LinearRegression(),"Local tree depth 3":DecisionTreeRegressor(max_depth=3,min_samples_leaf=18,random_state=SEED)}
local_preds={}
for name,model in local_models.items():
    model.fit(local_train,local_train_y)
    local_preds[name]=report(name,model,local_valid,local_valid_y)
print("Global fidelity uses held-out black-box predictions; local fidelity uses Gaussian perturbations around x0 (sigma=.12).")
print("Fidelity does not establish causality or real-world correctness.")
fig,axes=plt.subplots(1,2,figsize=(12,5),constrained_layout=True)
for ax,target,preds,title in [(axes[0],teacher_test,global_preds,"Global fidelity"),(axes[1],local_valid_y,local_preds,"Local fidelity")]:
    for name,pred in preds.items(): ax.scatter(target,pred,s=12,alpha=.35,label=name)
    lo,hi=float(target.min()),float(target.max())
    ax.plot([lo,hi],[lo,hi],linestyle="--",linewidth=1)
    ax.set(title=title,xlabel="Original model f(x)",ylabel="Surrogate g(x)")
    ax.legend()
plt.show()
